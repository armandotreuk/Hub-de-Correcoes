import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PromptLinkingService } from '../../services/prompt-linking.service';
import { CorrectionConfigService } from '../../services/correction-config.service';
import { PublicationService } from '../../services/publication.service';
import { PromptService } from '../../services/prompt.service';
import { GovernanceExportService } from '../../services/governance-export.service';
import {
  Discipline,
  Prompt,
  PromptLink,
  CorrectionConfig,
  PublicationConfig,
  UnifiedConfigRow,
} from '../../models/ia-corrections.models';
import { MultiSelectDropdownComponent } from '../shared/multi-select-dropdown/multi-select-dropdown.component';
import { PromptDetailModalComponent } from '../shared/prompt-detail-modal/prompt-detail-modal.component';
import { forkJoin, map } from 'rxjs';
import { SweetAlertService } from '../../services/sweet-alert.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-matrix-configuration-tab',
  standalone: true,
  imports: [CommonModule, FormsModule, MultiSelectDropdownComponent, PromptDetailModalComponent],
  templateUrl: './matrix-configuration-tab.component.html',
  styleUrls: ['./matrix-configuration-tab.component.css'],
})
export class MatrixConfigurationTabComponent implements OnInit {
  private linkingService = inject(PromptLinkingService);
  private correctionService = inject(CorrectionConfigService);
  private publicationService = inject(PublicationService);
  private promptService = inject(PromptService);
  private swalService = inject(SweetAlertService);
  private exportService = inject(GovernanceExportService);

  // Data
  allRows = signal<UnifiedConfigRow[]>([]);
  filteredRows = signal<UnifiedConfigRow[]>([]);
  prompts = signal<Prompt[]>([]);

  // Selection
  selectedIds = signal<Set<string>>(new Set());

  // Filters
  unitOptions = signal<{ value: any; label: string }[]>([]);
  clusterOptions = signal<{ value: any; label: string }[]>([]);
  courseOptions = signal<{ value: any; label: string }[]>([]);
  disciplineOptions = signal<{ value: any; label: string }[]>([]);
  activityTypeOptions = signal<{ value: any; label: string }[]>([
    { value: 'Desafio Profissional', label: 'Desafio Profissional' },
    { value: 'Resenha', label: 'Resenha' },
    { value: 'Fórum', label: 'Fórum' },
    { value: 'MAPA', label: 'MAPA' },
    { value: 'Prova', label: 'Prova' },
  ]);

  selectedUnits = signal<number[]>([]);
  selectedClusters = signal<number[]>([]);
  selectedCourses = signal<number[]>([]);
  selectedDisciplines = signal<number[]>([]);
  selectedActivityTypes = signal<string[]>([]);
  selectedPrompts = signal<string[]>([]);
  selectedIaStatuses = signal<string[]>([]);
  selectedPublicationStatuses = signal<string[]>([]);

  // Filter Options for new filters
  promptFilterOptions = computed(() => {
    const list = this.prompts();
    const selectedActs = this.selectedActivityTypes();
    const selectedUnits = this.selectedUnits();

    if (selectedActs.length === 0 && selectedUnits.length === 0) {
      return list.map((p) => ({ value: p.id, label: p.title }));
    }

    return list
      .filter((p) => {
        const matchAct = selectedActs.length === 0 || selectedActs.includes(p.activityTypeName);
        const matchUnit = selectedUnits.length === 0 || selectedUnits.includes(p.businessUnitId);
        return matchAct && matchUnit;
      })
      .map((p) => ({ value: p.id, label: p.title }));
  });
  iaStatusOptions = signal<{ value: any; label: string }[]>([
    { value: 'Ativo', label: 'Ativo' },
    { value: 'Inativo', label: 'Inativo' },
  ]);
  publicationStatusOptions = signal<{ value: any; label: string }[]>([
    { value: 'Ativa', label: 'Ativa' },
    { value: 'Inativa', label: 'Inativa' },
  ]);

  // Pagination
  currentPage = signal(1);
  itemsPerPage = signal(25);
  totalPages = computed(() => Math.ceil(this.filteredRows().length / this.itemsPerPage()));
  paginatedRows = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    return this.filteredRows().slice(start, start + this.itemsPerPage());
  });

  // Modal/Drawer Control
  isDrawerOpen = signal(false);
  editingRow = signal<UnifiedConfigRow | null>(null);
  bulkPromptId = signal<string>('');

  // Prompt Detail Modal
  isPromptModalOpen = signal(false);
  selectedPromptForDetail = signal<Prompt | null>(null);

  // Filtered prompts for Drawer (Regra 1.1 individual)
  compatibleDrawerPrompts = computed(() => {
    const row = this.editingRow();
    if (!row) return [];
    return this.prompts().filter(
      (p) =>
        p.activityTypeName === row.activityTypeName && p.businessUnitName === row.businessUnitName,
    );
  });

  ngOnInit() {
    this.loadInitialData();
  }

  loadInitialData() {
    // Carregar opções de filtros e prompts
    this.unitOptions.set([
      { value: 1, label: 'Uniasselvi' },
      { value: 2, label: 'Unicesumar' },
    ]);

    // Carregar Clusters, Cursos e Disciplinas para popular filtros (hierarquia simplificada para o protótipo)
    this.linkingService.getAllCourses().subscribe((courses) => {
      const clusters = Array.from(new Set(courses.map((c) => c.clusterId))).map((id) => ({
        value: id,
        label: courses.find((c) => c.clusterId === id)?.clusterName || `Cluster ${id}`,
      }));
      this.clusterOptions.set(clusters);
      this.courseOptions.set(courses.map((c) => ({ value: c.id, label: c.name })));
    });

    this.linkingService.getAllDisciplines().subscribe((disciplines) => {
      this.disciplineOptions.set(disciplines.map((d) => ({ value: d.id, label: d.name })));
    });

    this.promptService.getPrompts().subscribe((prompts) => {
      this.prompts.set(prompts);
    });
  }

  onSearch() {
    this.swalService.showLoading('Consolidando matriz de dados...');

    forkJoin({
      disciplines: this.linkingService.getDisciplinesByFilters(
        this.selectedUnits(),
        this.selectedClusters(),
        this.selectedCourses(),
      ),
      links: this.linkingService.getAllLinks(),
      corrections: this.correctionService.getConfigs(),
      publications: this.publicationService.getPublicationConfigs(),
    })
      .pipe(
        map(({ disciplines, links, corrections, publications }) => {
          const rows: UnifiedConfigRow[] = [];

          // Atividades base para o protótipo (em produção viria do backend)
          const activities = ['Desafio Profissional', 'Resenha', 'Fórum', 'MAPA', 'Prova'];

          disciplines.forEach((disc) => {
            activities.forEach((act) => {
              // Filtrar por atividade se selecionado
              if (
                this.selectedActivityTypes().length > 0 &&
                !this.selectedActivityTypes().includes(act)
              )
                return;
              if (
                this.selectedDisciplines().length > 0 &&
                !this.selectedDisciplines().includes(disc.id)
              )
                return;

              const link = links.find(
                (l) => l.disciplineId === disc.id && l.activityTypeName === act,
              );
              const correction = corrections.find(
                (c) => c.disciplineName === disc.name && c.activityTypeName === act,
              );
              const publication = publications.find(
                (p) => p.disciplineName === disc.name && p.activityTypeName === act,
              );

              const row: UnifiedConfigRow = {
                id: `${disc.id}_${act}`,
                disciplineId: disc.id,
                disciplineName: disc.name,
                courseName: disc.courseName,
                clusterName: disc.clusterName,
                businessUnitName: disc.businessUnitId === 1 ? 'Uniasselvi' : 'Unicesumar',
                activityTypeName: act,
                promptId: link?.promptId,
                promptTitle: link?.promptTitle,
                correctionStatus: correction?.correctionStatus || 'Inativo',
                publicationStatus: publication?.publicationStatus ?? 'Inativa',
                note: publication?.performanceThreshold,
                deadline: 3, // Mock deadline
              };

              // Aplicação dos novos filtros
              if (
                this.selectedPrompts().length > 0 &&
                (!row.promptId || !this.selectedPrompts().includes(row.promptId))
              )
                return;
              if (
                this.selectedIaStatuses().length > 0 &&
                !this.selectedIaStatuses().includes(row.correctionStatus)
              )
                return;
              if (
                this.selectedPublicationStatuses().length > 0 &&
                !this.selectedPublicationStatuses().includes(row.publicationStatus)
              )
                return;

              rows.push(row);
            });
          });
          return rows;
        }),
      )
      .subscribe((rows) => {
        this.allRows.set(rows);
        this.filteredRows.set(rows);
        this.selectedIds.set(new Set()); // Limpar seleção de itens
        this.currentPage.set(1);
        this.swalService.closeLoading();
      });
  }

  toggleSelection(id: string) {
    const newSelection = new Set(this.selectedIds());
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    this.selectedIds.set(newSelection);
  }

  toggleAll(event: any) {
    if (event.target.checked) {
      const allIds = this.paginatedRows().map((r) => r.id);
      this.selectedIds.set(new Set(allIds));
    } else {
      this.selectedIds.set(new Set());
    }
  }

  openDrawer(row: UnifiedConfigRow) {
    this.editingRow.set({ ...row });
    this.isDrawerOpen.set(true);
  }

  closeDrawer() {
    this.isDrawerOpen.set(false);
    this.editingRow.set(null);
  }

  saveIndividualConfig() {
    const row = this.editingRow();
    if (!row) return;

    // Regras de dependência no save (cascatas de inativação)
    if (!row.promptId && row.correctionStatus === 'Ativo') {
      row.correctionStatus = 'Inativo';
    }
    if (row.correctionStatus === 'Inativo' && row.publicationStatus === 'Ativa') {
      row.publicationStatus = 'Inativa';
    }

    // Atualizar título do prompt antes de salvar
    if (row.promptId) {
      const p = this.prompts().find((x) => x.id === row.promptId);
      if (p) row.promptTitle = p.title;
    } else {
      row.promptTitle = undefined;
    }

    // Simulação de salvamento
    this.swalService.showLoading('Salvando configurações...');
    setTimeout(() => {
      const idx = this.allRows().findIndex((r) => r.id === row.id);
      if (idx !== -1) {
        const updatedRows = [...this.allRows()];
        updatedRows[idx] = { ...row };
        this.allRows.set(updatedRows);
        this.filteredRows.set(updatedRows);
      }
      this.swalService.closeLoading();
      this.swalService.showSuccess('Sucesso', 'Configurações atualizadas para este registro.');
      this.closeDrawer();
    }, 800);
  }

  getActivityColorClass(activityName: string): string {
    const mapping: { [key: string]: string } = {
      'Desafio Profissional': 'badge-soft-primary',
      Resenha: 'badge-soft-info',
      Fórum: 'badge-soft-success',
      MAPA: 'badge-soft-secondary',
      Prova: 'badge-soft-danger',
      'Avaliação Final': 'badge-soft-warning',
    };
    return mapping[activityName] || 'badge-soft-dark';
  }

  openPromptDetail(row: UnifiedConfigRow) {
    if (!row.promptId) return;
    const prompt = this.prompts().find((p) => p.id === row.promptId);
    if (prompt) {
      this.selectedPromptForDetail.set(prompt);
      this.isPromptModalOpen.set(true);
    }
  }

  closePromptModal() {
    this.isPromptModalOpen.set(false);
    this.selectedPromptForDetail.set(null);
  }

  // Ações em Massa
  async onBulkManageCorrection() {
    // Pegar targets brutos
    const baseTargets =
      this.selectedIds().size > 0
        ? this.filteredRows().filter((r) => this.selectedIds().has(r.id))
        : this.filteredRows();

    if (baseTargets.length === 0) {
      this.swalService.showError('Aviso', 'Nenhum registro selecionado ou filtrado.');
      return;
    }

    // Regra 1.2: Apenas registros com prompt vinculado podem ter correção ativada
    const eligibleTargets = baseTargets.filter((r) => !!r.promptId);

    if (eligibleTargets.length === 0) {
      this.swalService.showError(
        'Ação Bloqueada',
        'Nenhum dos registros selecionados possui um prompt vinculado. A correção só pode ser gerenciada em registros com prompt.',
      );
      return;
    }

    let warningMsg = '';
    if (eligibleTargets.length < baseTargets.length) {
      const omitted = baseTargets.length - eligibleTargets.length;
      warningMsg = `<br><br><small class="text-danger">* ${omitted} registro(s) não cumprem os requisitos para a modificação e serão ignorados (prompt não vinculado).</small>`;
    }

    const { isConfirmed, isDenied } = await Swal.fire({
      title: 'Gerenciar Correção em Massa',
      html: `O que você deseja fazer com os <strong>${eligibleTargets.length}</strong> registros selecionados? ${warningMsg}`,
      icon: 'question',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Ativar',
      denyButtonText: 'Desativar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#0ab39c', // Verde
      denyButtonColor: '#f06548', // Vermelho
    });

    if (isConfirmed || isDenied) {
      this.swalService.showLoading('Processando...');
      const targetIds = eligibleTargets.map((t) => t.id);

      const newStatus = isConfirmed ? 'Ativo' : 'Inativo';
      const successText = isConfirmed ? 'ativados' : 'desativados';

      setTimeout(() => {
        const updated = this.allRows().map((r) => {
          if (targetIds.includes(r.id)) {
            // Regra Cascata: Se desativar correção, desativa publicação junto
            if (newStatus === 'Inativo') {
              return {
                ...r,
                correctionStatus: newStatus as any,
                publicationStatus: 'Inativa' as any,
              };
            }
            return { ...r, correctionStatus: newStatus as any };
          }
          return r;
        });
        this.allRows.set(updated);
        this.filteredRows.set(updated);
        this.swalService.closeLoading();
        this.swalService.showSuccess(
          'Concluído',
          `${targetIds.length} registros ${successText} com sucesso.`,
        );
      }, 1000);
    }
  }

  async onBulkLinkPrompt() {
    // Para vincular em massa, é preciso extrair os cursos contidos no escopo (selecionado ou filtrado)
    const baseTargets =
      this.selectedIds().size > 0
        ? this.filteredRows().filter((r) => this.selectedIds().has(r.id))
        : this.filteredRows();

    if (baseTargets.length === 0) {
      this.swalService.showError('Aviso', 'Nenhum registro selecionado ou filtrado para vincular.');
      return;
    }

    // Regra 1.1: Mapear Unidades de Negócio e Tipos de Atividade presentes no escopo
    const uniqueBUs = Array.from(new Set(baseTargets.map((r) => r.businessUnitName)));
    const uniqueActivities = Array.from(new Set(baseTargets.map((r) => r.activityTypeName)));

    if (uniqueBUs.length !== 1 || uniqueActivities.length !== 1) {
      this.swalService.showError(
        'Ação Bloqueada',
        'Para vincular um prompt em massa, garanta que os registros selecionados pertençam à mesma "Unidade de Negócio" e "Tipo de Atividade". Refine seu filtro (ou seleção) para isolar um grupo único.',
      );
      return;
    }

    const targetBU = uniqueBUs[0];
    const targetActivity = uniqueActivities[0];

    // Regra 2: Filtrar os prompts por BU e Atividade validada
    const promptOptions: { [key: string]: string } = {};
    const compatiblePrompts = this.prompts().filter(
      (p) => p.activityTypeName === targetActivity && p.businessUnitName === targetBU,
    );

    if (compatiblePrompts.length === 0) {
      this.swalService.showError(
        'Nenhum Prompt Encontrado',
        `Não existem prompts cadastrados para a atividade "${targetActivity}" na unidade "${targetBU}".`,
      );
      return;
    }

    compatiblePrompts.forEach((p) => {
      promptOptions[p.id] = p.title;
    });

    const selectedPromptId = await this.swalService.selectOption(
      'Vincular Prompt em Massa',
      `Selecione o prompt válido associado (BU/Ativ.)`,
      promptOptions,
    );

    if (selectedPromptId) {
      const selectedPrompt = this.prompts().find((p) => p.id === selectedPromptId);
      if (!selectedPrompt) return;

      this.swalService.showLoading('Vinculando prompt...');

      setTimeout(() => {
        const targetIds = baseTargets.map((t) => t.id);
        const updated = this.allRows().map((r) => {
          if (targetIds.includes(r.id)) {
            return {
              ...r,
              promptId: selectedPrompt.id,
              promptTitle: selectedPrompt.title,
            };
          }
          return r;
        });

        this.allRows.set(updated);
        this.filteredRows.set(updated);
        this.swalService.closeLoading();
        this.swalService.showSuccess(
          'Concluído',
          `${targetIds.length} registros vinculados ao prompt: ${selectedPrompt.title}`,
        );
      }, 1000);
    }
  }

  async onBulkManagePublication() {
    const baseTargets =
      this.selectedIds().size > 0
        ? this.filteredRows().filter((r) => this.selectedIds().has(r.id))
        : this.filteredRows();

    if (baseTargets.length === 0) {
      this.swalService.showError(
        'Aviso',
        'Nenhum registro selecionado ou filtrado para configurar.',
      );
      return;
    }

    // Regra 1.3: Publicação só gerenciada em registros com correção ativa
    const eligibleTargets = baseTargets.filter((r) => r.correctionStatus === 'Ativo');

    if (eligibleTargets.length === 0) {
      this.swalService.showError(
        'Ação Bloqueada',
        'Nenhum dos registros selecionados possui "Correção por IA" Ativa. A publicação depende da correção.',
      );
      return;
    }

    let warningMsg = '';
    if (eligibleTargets.length < baseTargets.length) {
      const omitted = baseTargets.length - eligibleTargets.length;
      warningMsg = `<br><br><small class="text-danger">* ${omitted} registro(s) não cumprem os requisitos para a modificação e serão ignorados (correção inativa).</small>`;
    }

    const swalResult = await Swal.fire({
      title: `Gerenciar Publicação (Qtd: ${eligibleTargets.length})`,
      html: `
        O que você deseja fazer com os <strong>${eligibleTargets.length}</strong> registros?
        ${warningMsg}
        <hr class="my-3">
        <div class="mb-3 text-left">
          <label class="form-label small font-weight-bold">Nota Mínima (0-100)</label>
          <input id="swal-note" type="number" class="form-control" placeholder="Apenas para Ativação" min="0" max="100">
        </div>
        <div class="mb-3 text-left">
          <label class="form-label small font-weight-bold">Prazo para Liberação (Dias)</label>
          <input id="swal-deadline" type="number" class="form-control" placeholder="Apenas para Ativação" min="0">
        </div>
        <small class="text-muted d-block text-left">* Os campos acima serão ignorados se você optar por <b>Desativar</b>.</small>
      `,
      focusConfirm: false,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Configurar e Ativar',
      denyButtonText: 'Desativar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#0ab39c',
      denyButtonColor: '#f06548',
      preConfirm: () => {
        // Validation only applies if the user is confirming (Activating)
        const note = (document.getElementById('swal-note') as HTMLInputElement).value;
        const deadline = (document.getElementById('swal-deadline') as HTMLInputElement).value;

        if (!note || !deadline) {
          Swal.showValidationMessage('Ambos os campos numéricos são obrigatórios para Ativar');
          return false;
        }
        return { note: parseInt(note), deadline: parseInt(deadline) };
      },
    });

    if (swalResult.isConfirmed) {
      this.swalService.showLoading('Processando...');
      const targetIds = eligibleTargets.map((t) => t.id);
      const formValues = swalResult.value;

      setTimeout(() => {
        const updated = this.allRows().map((r) => {
          if (targetIds.includes(r.id)) {
            return {
              ...r,
              publicationStatus: 'Ativa' as const,
              note: formValues.note,
              deadline: formValues.deadline,
            };
          }
          return r;
        });
        this.allRows.set(updated);
        this.filteredRows.set(updated);
        this.swalService.closeLoading();
        this.swalService.showSuccess(
          'Concluído',
          `${targetIds.length} registros com publicação ATIVADA com sucesso.`,
        );
      }, 1000);
    } else if (swalResult.isDenied) {
      this.swalService.showLoading('Inativando...');
      const targetIds = eligibleTargets.map((t) => t.id);

      setTimeout(() => {
        const updated = this.allRows().map((r) => {
          if (targetIds.includes(r.id)) {
            // Nullify note and deadline upon unchecking
            return {
              ...r,
              publicationStatus: 'Inativa' as const,
              note: null,
              deadline: null,
            };
          }
          return r;
        });
        this.allRows.set(updated);
        this.filteredRows.set(updated);
        this.swalService.closeLoading();
        this.swalService.showSuccess(
          'Concluído',
          `${targetIds.length} registros tiveram a publicação DESATIVADA.`,
        );
      }, 1000);
    }
  }

  async onExportMatrix() {
    const targets = this.filteredRows();
    if (targets.length === 0) {
      this.swalService.showError(
        'Ação Bloqueada',
        'Não existem registros filtrados na tabela para serem exportados.',
      );
      return;
    }

    const { isConfirmed } = await Swal.fire({
      title: 'Exportar Registros',
      text: `Deseja gerar a exportação dos ${targets.length} registros atualmente restritos em tela?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, exportar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#405189',
    });

    if (isConfirmed) {
      this.swalService.showLoading('Processando a exportação...');

      setTimeout(() => {
        this.exportService.exportMatrix(targets, this.prompts());
        this.swalService.closeLoading();
        this.swalService.showSuccess(
          'Sucesso',
          `${targets.length} registros foram compilados com sucesso. O download iniciará em instantes.`,
        );
      }, 1500);
    }
  }

  showRegras() {
    Swal.fire({
      title: 'Regras do Processo',
      html: `
        <div class="text-left small font-weight-500">
          As notas de IA só serão publicadas se:<br><br>
          1. A correção estiver Ativa;<br>
          2. O Prompt estiver vinculado;<br>
          3. A nota da IA for superior ao limite configurado.
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'OK',
      confirmButtonColor: '#405189',
      showCancelButton: false,
    });
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }

  onItemsPerPageChange(size: number) {
    this.itemsPerPage.set(size);
    this.currentPage.set(1);
  }
}
