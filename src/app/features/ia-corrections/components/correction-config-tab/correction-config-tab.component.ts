import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CorrectionConfigService } from '../../services/correction-config.service';
import { SweetAlertService } from '../../services/sweet-alert.service';
import { CorrectionConfig } from '../../models/ia-corrections.models';
import {
  MultiSelectOption,
  MultiSelectDropdownComponent,
} from '../shared/multi-select-dropdown/multi-select-dropdown.component';
import { PromptDetailModalComponent } from '../shared/prompt-detail-modal/prompt-detail-modal.component';
import { PromptService } from '../../services/prompt.service';
import { Prompt } from '../../models/ia-corrections.models';

@Component({
  selector: 'app-correction-config-tab',
  standalone: true,
  imports: [CommonModule, FormsModule, MultiSelectDropdownComponent, PromptDetailModalComponent],
  templateUrl: './correction-config-tab.component.html',
  styleUrls: ['./correction-config-tab.component.css'],
})
export class CorrectionConfigTabComponent implements OnInit {
  private service = inject(CorrectionConfigService);
  private sweetAlertService = inject(SweetAlertService);
  private promptService = inject(PromptService);

  configs = signal<CorrectionConfig[]>([]);
  isLoading = signal(true);
  prompts = signal<Prompt[]>([]);

  // v4: Filtros (E.7)
  selectedUnits = signal<string[]>([]);
  selectedClusters = signal<string[]>([]);
  selectedCourses = signal<string[]>([]);
  selectedDisciplines = signal<string[]>([]);
  selectedActivities = signal<string[]>([]);
  selectedPrompts = signal<string[]>([]);
  selectedStatuses = signal<string[]>([]);

  displayedConfigs = signal<CorrectionConfig[]>([]); // v4: Searched data

  // v4: Modal
  isModalOpen = signal(false);
  modalPrompt = signal<Prompt | null>(null);

  // Options
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

  // v4: Disciplina Options
  disciplineOptions = computed<MultiSelectOption[]>(() => {
    const courses = this.selectedCourses();
    const data =
      courses.length === 0
        ? this.configs()
        : this.configs().filter((c) => courses.includes(c.courseName));
    return this.getUniqueOptions(data, 'disciplineName');
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

  // Selection
  selectedIds = signal<Set<string>>(new Set());

  // Pagination
  currentPage = signal(1);
  itemsPerPage = signal(25);

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
        this.selectedStatuses().length === 0 ||
        this.selectedStatuses().includes(c.correctionStatus);

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

  totalPages = computed(() => {
    return Math.max(1, Math.ceil(this.filteredConfigs().length / this.itemsPerPage()));
  });

  ngOnInit() {
    this.loadData();
    this.promptService.getPrompts().subscribe((p) => this.prompts.set(p));
  }

  loadData() {
    this.isLoading.set(true);
    this.service.getConfigs().subscribe((data) => {
      this.configs.set(data);
      this.displayedConfigs.set(data); // v4: Initial load
      this.isLoading.set(false);
    });
  }

  // v4: E.2 Botão Pesquisar
  onSearch() {
    this.sweetAlertService.showLoading('Buscando registros...');
    this.service.getConfigs().subscribe({
      next: (data) => {
        this.displayedConfigs.set(data);
        this.currentPage.set(1);
        this.sweetAlertService.closeLoading();
      },
      error: () => this.sweetAlertService.closeLoading(),
    });
  }

  toggleSingleStatus(config: CorrectionConfig) {
    const newStatus = config.correctionStatus === 'Ativo' ? 'Inativo' : 'Ativo';
    this.service.updateStatus(config.id, newStatus).subscribe((updated) => {
      this.configs.update((list) => list.map((c) => (c.id === updated.id ? updated : c)));
      this.displayedConfigs.update((list) => list.map((c) => (c.id === updated.id ? updated : c)));
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

  // v4: E.4 Botão "Ativar em Massa" (Smart Logic)
  async onMassAction() {
    const selectedCount = this.selectedIds().size;
    const filteredCount = this.filteredConfigs().length;

    // v4: Use selected IDs if any, else use filtered IDs (all records from the search)
    const targets =
      selectedCount > 0
        ? this.filteredConfigs().filter((c) => this.selectedIds().has(c.id))
        : this.filteredConfigs();

    const hasInactive = targets.some((t) => t.correctionStatus === 'Inativo');
    const newStatus = hasInactive ? 'Ativo' : 'Inativo';
    const action = hasInactive ? 'ativar' : 'inativar';

    const count = targets.length;
    const label = selectedCount > 0 ? `${count} selecionados` : `${count} filtrados`;

    const confirmed = await this.sweetAlertService.confirmAction(
      'Confirmar Ação',
      `Deseja ${action} ${label}?`,
    );

    if (!confirmed) return;

    this.sweetAlertService.showLoading('Processando...');
    this.service
      .updateStatuses(
        targets.map((t) => t.id),
        newStatus,
      )
      .subscribe(() => {
        this.sweetAlertService.closeLoading();
        this.sweetAlertService.showSuccess(
          'Concluído!',
          `${count} registros ${action === 'ativar' ? 'ativados' : 'inativados'}.`,
        );
        this.loadData();
        this.selectedIds.set(new Set());
      });
  }

  // v4: E.5 Modal de Prompt
  openPromptModal(promptTitle: string) {
    const prompt = this.prompts().find((p) => p.title === promptTitle);
    if (prompt) {
      this.modalPrompt.set(prompt);
      this.isModalOpen.set(true);
    }
  }

  onSaveObservations(data: { id: string; observations: string }) {
    this.promptService.updatePromptObservations(data.id, data.observations).subscribe(() => {
      // Update local prompt if needed, though modal is usually read-only view
      this.isModalOpen.set(false);
      this.sweetAlertService.showSuccess('Sucesso', 'Observações salvas.');
    });
  }

  // v4: E.6 Export to CSV
  exportToCSV() {
    const headers = [
      'Status',
      'Unidade de Negócio',
      'Cluster',
      'Curso',
      'Disciplina',
      'Tipo de Atividade',
      'Prompt',
      'Criado em',
      'Criado por',
      'Atualizado em',
      'Atualizado por',
    ];
    const rows = this.filteredConfigs().map((c) => [
      c.correctionStatus,
      c.businessUnitName,
      c.clusterName,
      c.courseName,
      c.disciplineName,
      c.activityTypeName,
      c.promptTitle,
      c.createdAt || '',
      c.createdBy || '',
      c.updatedAt || '',
      c.updatedBy || '',
    ]);
    const csv = [headers, ...rows].map((r) => r.join(';')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `correcoes-ia-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
