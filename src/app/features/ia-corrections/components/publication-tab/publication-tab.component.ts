import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PublicationService } from '../../services/publication.service';
import { SweetAlertService } from '../../services/sweet-alert.service';
import { PublicationConfig, PublicationGlobalSettings } from '../../models/ia-corrections.models';
import {
  MultiSelectOption,
  MultiSelectDropdownComponent,
} from '../shared/multi-select-dropdown/multi-select-dropdown.component';

@Component({
  selector: 'app-publication-tab',
  standalone: true,
  imports: [CommonModule, FormsModule, MultiSelectDropdownComponent],
  templateUrl: './publication-tab.component.html',
  styleUrls: ['./publication-tab.component.css'],
})
export class PublicationTabComponent implements OnInit {
  private service = inject(PublicationService);
  private sweetAlertService = inject(SweetAlertService);

  configs = signal<PublicationConfig[]>([]);
  displayedConfigs = signal<PublicationConfig[]>([]); // v4: Searched data
  isLoading = signal(true);

  // Configurações Globais
  globalNote = signal<number | null>(null);
  globalDeadline = signal<number | null>(null);
  // v4: F.5 Remover toggle, usar botão "Ativar Publicação"

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

  // v4: Filtros (F.3 & F.4)
  selectedUnits = signal<string[]>([]);
  selectedClusters = signal<string[]>([]);
  selectedCourses = signal<string[]>([]);
  selectedDisciplines = signal<string[]>([]);
  selectedActivities = signal<string[]>([]);
  selectedPrompts = signal<string[]>([]);
  selectedStatusesArr = signal<string[]>([]);

  // Options
  unitOptions = computed(() => this.getUniqueOptions(this.configs(), 'businessUnitName'));
  clusterOptions = computed(() => {
    const units = this.selectedUnits();
    const data =
      units.length === 0
        ? this.configs()
        : this.configs().filter((c) => units.includes(c.businessUnitName));
    return this.getUniqueOptions(data, 'clusterName');
  });
  courseOptions = computed(() => {
    const clusters = this.selectedClusters();
    const data =
      clusters.length === 0
        ? this.configs()
        : this.configs().filter((c) => clusters.includes(c.clusterName));
    return this.getUniqueOptions(data, 'courseName');
  });
  // v4: F.3 Disciplina Options
  disciplineOptions = computed(() => {
    const courses = this.selectedCourses();
    const data =
      courses.length === 0
        ? this.configs()
        : this.configs().filter((c) => courses.includes(c.courseName));
    return this.getUniqueOptions(data, 'disciplineName');
  });

  activityOptions = computed(() => this.getUniqueOptions(this.configs(), 'activityTypeName'));
  promptOptions = computed(() => this.getUniqueOptions(this.configs(), 'promptTitle'));
  statusOptions: MultiSelectOption[] = [
    { value: 'Ativa', label: 'Ativa' },
    { value: 'Inativa', label: 'Inativa' },
  ];

  private getUniqueOptions(data: any[], key: string): MultiSelectOption[] {
    const unique = Array.from(new Set(data.map((item) => item[key]))).sort();
    return unique.map((val) => ({ value: val, label: val as string }));
  }

  // Selection
  selectedIds = signal<Set<string>>(new Set());
  currentPage = signal(1);
  itemsPerPage = signal(25);

  // v4: F.6 Updated logic to include status in filtering (applied to displayedConfigs)
  filteredConfigs = computed(() => {
    return this.displayedConfigs().filter((c) => {
      const matchUnit =
        this.selectedUnits().length === 0 || this.selectedUnits().includes(c.businessUnitName);
      const matchCluster =
        this.selectedClusters().length === 0 || this.selectedClusters().includes(c.clusterName);
      const matchCourse =
        this.selectedCourses().length === 0 || this.selectedCourses().includes(c.courseName);
      const matchDiscipline =
        this.selectedDisciplines().length === 0 ||
        this.selectedDisciplines().includes(c.disciplineName);
      const matchActivity =
        this.selectedActivities().length === 0 ||
        this.selectedActivities().includes(c.activityTypeName);
      const matchPrompt =
        this.selectedPrompts().length === 0 || this.selectedPrompts().includes(c.promptTitle);
      const matchStatus =
        this.selectedStatusesArr().length === 0 ||
        this.selectedStatusesArr().includes(c.publicationStatus);
      return (
        matchUnit &&
        matchCluster &&
        matchCourse &&
        matchDiscipline &&
        matchActivity &&
        matchPrompt &&
        matchStatus
      );
    });
  });

  paginatedConfigs = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return this.filteredConfigs().slice(start, end);
  });

  totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredConfigs().length / this.itemsPerPage())),
  );

  ngOnInit() {
    this.loadData();
    this.loadGlobalSettings();
  }

  loadData() {
    this.isLoading.set(true);
    this.service.getPublicationConfigs().subscribe((data) => {
      this.configs.set(data);
      this.displayedConfigs.set(data); // v4: Initial load
      this.isLoading.set(false);
    });
  }

  loadGlobalSettings() {
    this.service.getGlobalSettings().subscribe((s) => {
      this.globalNote.set(s.note);
      this.globalDeadline.set(s.deadline);
    });
  }

  // v4: F.4 Botão Pesquisar
  onSearch() {
    this.sweetAlertService.showLoading('Buscando registros...');
    this.service.getPublicationConfigs().subscribe({
      next: (data) => {
        this.displayedConfigs.set(data);
        this.currentPage.set(1);
        this.sweetAlertService.closeLoading();
      },
      error: () => this.sweetAlertService.closeLoading(),
    });
  }

  toggleAutoPublication() {
    // v4: F.5 This logic is replaced by the mass button, but keeping for global config if needed
    // Or removed entirely if "Ativar Publicação" replaces it completely for row actions too.
    // Let's assume we keep global settings but trigger via button now? Actually, let's keep simple.
    if (!this.canEnableAutoPublication()) return;
    // Logic for global auto publication toggle if still needed.
    // The requirement says "Remover o toggle ... do painel de configurações globais".
    // So we should probably remove this method or make it do nothing/disable.
  }

  toggleSingleStatus(config: PublicationConfig) {
    // v4: F.6 Update logic: If correction is Inativo, disable button, but do NOT auto-toggle publication.
    if (config.correctionStatus === 'Inativo') return; // Cannot toggle if correction is inactive

    const newStatus = config.publicationStatus === 'Ativa' ? 'Inativa' : 'Ativa';
    this.service.updatePublicationStatus(config.id, newStatus).subscribe((updated) => {
      this.configs.update((list) => list.map((c) => (c.id === updated.id ? updated : c)));
      this.displayedConfigs.update((list) => list.map((c) => (c.id === updated.id ? updated : c)));
    });
  }

  // v4: F.5 Botão "Ativar Publicação" (Smart Logic)
  async onMassAction() {
    const selectedCount = this.selectedIds().size;
    const filteredCount = this.filteredConfigs().length;

    // v4: Use selected IDs if any, else use filtered IDs
    const targets =
      selectedCount > 0
        ? this.filteredConfigs().filter((c) => this.selectedIds().has(c.id))
        : this.filteredConfigs();

    // Filter out targets where correction is inactive (F.6)
    const validTargets = targets.filter((t) => t.correctionStatus === 'Ativo');

    if (validTargets.length === 0) {
      this.sweetAlertService.showError(
        'Erro',
        'Nenhum registro elegível para publicação. Verifique se a correção está ativa.',
      );
      return;
    }

    const hasDisabled = validTargets.some((t) => t.publicationStatus === 'Inativa');
    const newStatus = hasDisabled ? 'Ativa' : 'Inativa';
    const action = hasDisabled ? 'ativar' : 'inativar';

    const eligibleCount = validTargets.length;
    const ineligibleCount = targets.length - validTargets.length;
    const mode = selectedCount > 0 ? 'selecionados' : 'filtrados';

    let message = `Deseja ${action} a publicação para os registros elegíveis (${mode})?\n\n`;
    message += `• ${eligibleCount} Elegíveis (Correção Ativa)\n`;
    if (ineligibleCount > 0) {
      message += `• ${ineligibleCount} Inelegíveis (Correção Inativa)\n`;
    }

    const confirmed = await this.sweetAlertService.confirmAction('Confirmar Publicação', message);

    if (!confirmed) return;

    this.sweetAlertService.showLoading('Processando...');
    this.service
      .updatePublicationStatuses(
        validTargets.map((t) => t.id),
        newStatus,
      )
      .subscribe(() => {
        this.sweetAlertService.closeLoading();
        this.sweetAlertService.showSuccess(
          'Concluído!',
          `${eligibleCount} registros ${action === 'ativar' ? 'ativados' : 'inativados'}.`,
        );
        this.loadData();
        this.selectedIds.set(new Set());
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
      // v4: Only select rows where correction is active? Or just all filtered?
      // Usually select all visible (paginated)
      const ids = this.paginatedConfigs().map((c) => c.id);
      this.selectedIds.set(new Set(ids));
    } else {
      this.selectedIds.set(new Set());
    }
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
