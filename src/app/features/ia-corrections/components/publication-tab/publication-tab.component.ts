import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PublicationService } from '../../services/publication.service';
import { PublicationConfig, PublicationGlobalSettings } from '../../models/ia-corrections.models';
import {
  MultiSelectOption,
  MultiSelectDropdownComponent,
} from '../shared/multi-select-dropdown/multi-select-dropdown.component';

@Component({
  selector: 'app-publication-tab',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MultiSelectDropdownComponent,
  ],
  templateUrl: './publication-tab.component.html',
  styleUrls: ['./publication-tab.component.css'],
})
export class PublicationTabComponent implements OnInit {
  private service = inject(PublicationService);

  configs = signal<PublicationConfig[]>([]);
  isLoading = signal(true);

  // Configurações Globais (Fase F.1, F.2)
  globalNote = signal<number | null>(null);
  globalDeadline = signal<number | null>(null);
  isAutoPublicationEnabled = signal(false);

  canEnableAutoPublication = computed(() => {
    const note = this.globalNote();
    const deadline = this.globalDeadline();
    return (
      note !== null &&
      deadline !== null &&
      Number.isInteger(note) &&
      Number.isInteger(deadline) &&
      note >= 0 &&
      note <= 100 &&
      deadline >= 0 &&
      deadline <= 99
    );
  });

  // Filtros MultiSelect (Fase F.3)
  selectedUnits = signal<string[]>([]);
  selectedClusters = signal<string[]>([]);
  selectedCourses = signal<string[]>([]);
  selectedActivities = signal<string[]>([]);
  selectedPrompts = signal<string[]>([]);
  selectedStatusesArr = signal<string[]>([]);

  // Opções para MultiSelect (Reutilizando lógica da Aba 3)
  unitOptions = computed(() => this.getUniqueOptions(this.configs(), 'businessUnitName'));
  clusterOptions = computed(() => {
    const units = this.selectedUnits();
    const data = units.length === 0 ? this.configs() : this.configs().filter(c => units.includes(c.businessUnitName));
    return this.getUniqueOptions(data, 'clusterName');
  });
  courseOptions = computed(() => {
    const clusters = this.selectedClusters();
    const data = clusters.length === 0 ? this.configs() : this.configs().filter(c => clusters.includes(c.clusterName));
    return this.getUniqueOptions(data, 'courseName');
  });
  activityOptions = computed(() => this.getUniqueOptions(this.configs(), 'activityTypeName'));
  promptOptions = computed(() => this.getUniqueOptions(this.configs(), 'promptTitle'));
  statusOptions: MultiSelectOption[] = [
    { value: 'Habilitado', label: 'Habilitado' },
    { value: 'Desabilitado', label: 'Desabilitado' },
  ];

  private getUniqueOptions(data: any[], key: string): MultiSelectOption[] {
    const unique = Array.from(new Set(data.map(item => item[key]))).sort();
    return unique.map(val => ({ value: val, label: val as string }));
  }

  // Seleção e Paginação (Fase F.4)
  selectedIds = signal<Set<string>>(new Set());
  currentPage = signal(1);
  itemsPerPage = signal(25);

  filteredConfigs = computed(() => {
    return this.configs().filter(c => {
      const matchUnit = this.selectedUnits().length === 0 || this.selectedUnits().includes(c.businessUnitName);
      const matchCluster = this.selectedClusters().length === 0 || this.selectedClusters().includes(c.clusterName);
      const matchCourse = this.selectedCourses().length === 0 || this.selectedCourses().includes(c.courseName);
      const matchActivity = this.selectedActivities().length === 0 || this.selectedActivities().includes(c.activityTypeName);
      const matchPrompt = this.selectedPrompts().length === 0 || this.selectedPrompts().includes(c.promptTitle);
      const matchStatus = this.selectedStatusesArr().length === 0 || this.selectedStatusesArr().includes(c.publicationStatus);
      return matchUnit && matchCluster && matchCourse && matchActivity && matchPrompt && matchStatus;
    });
  });

  paginatedConfigs = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return this.filteredConfigs().slice(start, end);
  });

  totalPages = computed(() => Math.max(1, Math.ceil(this.filteredConfigs().length / this.itemsPerPage())));

  ngOnInit() {
    this.loadData();
    this.loadGlobalSettings();
  }

  loadData() {
    this.isLoading.set(true);
    this.service.getPublicationConfigs().subscribe(data => {
      this.configs.set(data);
      this.isLoading.set(false);
    });
  }

  loadGlobalSettings() {
    this.service.getGlobalSettings().subscribe(s => {
      this.globalNote.set(s.note);
      this.globalDeadline.set(s.deadline);
      this.isAutoPublicationEnabled.set(s.autoPublicationEnabled);
    });
  }

  toggleAutoPublication() {
    if (!this.canEnableAutoPublication()) return;
    const newState = !this.isAutoPublicationEnabled();
    this.service.saveGlobalSettings(this.globalNote()!, this.globalDeadline()!, newState).subscribe(() => {
      this.isAutoPublicationEnabled.set(newState);
      alert(newState ? 'Publicação automática ativada!' : 'Publicação automática desativada.');
    });
  }

  toggleSingleStatus(config: PublicationConfig) {
    if (config.correctionStatus === 'Inativo') return;
    const newStatus = config.publicationStatus === 'Habilitado' ? 'Desabilitado' : 'Habilitado';
    this.service.updatePublicationStatus(config.id, newStatus).subscribe(updated => {
      this.configs.update(list => list.map(c => c.id === updated.id ? updated : c));
    });
  }

  onMassAction() {
    const ids = Array.from(this.selectedIds());
    const first = this.configs().find(c => c.id === ids[0]);
    if (!first) return;
    const newStatus = first.publicationStatus === 'Habilitado' ? 'Desabilitado' : 'Habilitado';
    this.service.updatePublicationStatuses(ids, newStatus).subscribe(() => {
      this.loadData();
      this.selectedIds.set(new Set());
      alert('Status de publicação atualizados!');
    });
  }

  toggleSelection(id: string) {
    this.selectedIds.update(set => {
      const newSet = new Set(set);
      if (newSet.has(id)) newSet.delete(id); else newSet.add(id);
      return newSet;
    });
  }

  toggleAll(checked: boolean) {
    if (checked) {
      const ids = this.paginatedConfigs().filter(c => c.correctionStatus === 'Ativo').map(c => c.id);
      this.selectedIds.set(new Set(ids));
    } else {
      this.selectedIds.set(new Set());
    }
  }

  prevPage() { if (this.currentPage() > 1) this.currentPage.set(this.currentPage() - 1); }
  nextPage() { if (this.currentPage() < this.totalPages()) this.currentPage.set(this.currentPage() + 1); }
  onItemsPerPageChange(size: number) { this.itemsPerPage.set(size); this.currentPage.set(1); }
}
