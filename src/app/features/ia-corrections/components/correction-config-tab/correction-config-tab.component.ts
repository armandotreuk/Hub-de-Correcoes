import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CorrectionConfigService } from '../../services/correction-config.service';
import { CorrectionConfig } from '../../models/ia-corrections.models';
import { MultiSelectOption, MultiSelectDropdownComponent } from '../shared/multi-select-dropdown/multi-select-dropdown.component';

@Component({
  selector: 'app-correction-config-tab',
  standalone: true,
  imports: [CommonModule, FormsModule, MultiSelectDropdownComponent],
  templateUrl: './correction-config-tab.component.html',
  styleUrls: ['./correction-config-tab.component.css'],
})
export class CorrectionConfigTabComponent implements OnInit {
  private service = inject(CorrectionConfigService);

  configs = signal<CorrectionConfig[]>([]);
  isLoading = signal(true);

  // Filtros MultiSelect (Fase E.1)
  selectedUnits = signal<string[]>([]);
  selectedClusters = signal<string[]>([]);
  selectedCourses = signal<string[]>([]);
  selectedActivities = signal<string[]>([]);
  selectedPrompts = signal<string[]>([]);
  selectedStatuses = signal<string[]>([]);

  // Opções para MultiSelect com Lógica de Cascata (Fase E.2)
  unitOptions = computed<MultiSelectOption[]>(() =>
    this.getUniqueOptions(this.configs(), 'businessUnitName'),
  );

  clusterOptions = computed<MultiSelectOption[]>(() => {
    const units = this.selectedUnits();
    const data =
      units.length === 0
        ? this.configs()
        : this.configs().filter((c) => units.includes(c.businessUnitName));
    return this.getUniqueOptions(data, 'clusterName');
  });

  courseOptions = computed<MultiSelectOption[]>(() => {
    const clusters = this.selectedClusters();
    const data =
      clusters.length === 0
        ? this.configs()
        : this.configs().filter((c) => clusters.includes(c.clusterName));
    return this.getUniqueOptions(data, 'courseName');
  });

  activityOptions = computed<MultiSelectOption[]>(() =>
    this.getUniqueOptions(this.configs(), 'activityTypeName'),
  );

  promptOptions = computed<MultiSelectOption[]>(() =>
    this.getUniqueOptions(this.configs(), 'promptTitle'),
  );

  statusOptions: MultiSelectOption[] = [
    { value: 'Ativo', label: 'Ativo' },
    { value: 'Inativo', label: 'Inativo' },
  ];

  private getUniqueOptions(data: any[], key: string): MultiSelectOption[] {
    const unique = Array.from(new Set(data.map((item) => item[key]))).sort();
    return unique.map((val) => ({ value: val, label: val as string }));
  }

  // Seleção em Lote
  selectedIds = signal<Set<string>>(new Set());

  // Paginação Padronizada (Fase E.3)
  currentPage = signal(1);
  itemsPerPage = signal(25);

  filteredConfigs = computed(() => {
    return this.configs().filter((c) => {
      const matchUnit =
        this.selectedUnits().length === 0 || this.selectedUnits().includes(c.businessUnitName);
      const matchCluster =
        this.selectedClusters().length === 0 || this.selectedClusters().includes(c.clusterName);
      const matchCourse =
        this.selectedCourses().length === 0 || this.selectedCourses().includes(c.courseName);
      const matchActivity =
        this.selectedActivities().length === 0 || this.selectedActivities().includes(c.activityTypeName);
      const matchPrompt =
        this.selectedPrompts().length === 0 || this.selectedPrompts().includes(c.promptTitle);
      const matchStatus =
        this.selectedStatuses().length === 0 || this.selectedStatuses().includes(c.correctionStatus);

      return (
        matchUnit && matchCluster && matchCourse && matchActivity && matchPrompt && matchStatus
      );
    });
  });

  paginatedConfigs = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return this.filteredConfigs().slice(start, end);
  });

  totalPages = computed(() => {
    return Math.max(1, Math.ceil(this.filteredConfigs().length / this.itemsPerPage()));
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);
    this.service.getConfigs().subscribe((data) => {
      this.configs.set(data);
      this.isLoading.set(false);
    });
  }

  toggleSingleStatus(config: CorrectionConfig) {
    const newStatus = config.correctionStatus === 'Ativo' ? 'Inativo' : 'Ativo';
    this.service.updateStatus(config.id, newStatus).subscribe((updated) => {
      this.configs.update((list) => list.map((c) => (c.id === updated.id ? updated : c)));
    });
  }

  toggleSelection(id: string) {
    this.selectedIds.update((set) => {
      const newSet = new Set(set);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  }

  toggleAll(checked: boolean) {
    if (checked) {
      const ids = this.paginatedConfigs().map((c) => c.id);
      this.selectedIds.set(new Set(ids));
    } else {
      this.selectedIds.set(new Set());
    }
  }

  onMassAction() {
    const ids = Array.from(this.selectedIds());
    if (ids.length === 0) return;

    const first = this.configs().find((c) => c.id === ids[0]);
    if (!first) return;

    const newStatus = first.correctionStatus === 'Ativo' ? 'Inativo' : 'Ativo';
    this.service.updateStatuses(ids, newStatus).subscribe(() => {
      this.loadData();
      this.selectedIds.set(new Set());
      alert('Status atualizados em lote!');
    });
  }

  prevPage() {
    if (this.currentPage() > 1) this.currentPage.set(this.currentPage() - 1);
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) this.currentPage.set(this.currentPage() + 1);
  }

  onItemsPerPageChange(size: number) {
    this.itemsPerPage.set(size);
    this.currentPage.set(1);
  }
}
