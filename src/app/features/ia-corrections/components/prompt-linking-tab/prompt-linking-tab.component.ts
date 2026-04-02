import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PromptLinkingService } from '../../services/prompt-linking.service';
import { PromptService } from '../../services/prompt.service';
import { SweetAlertService } from '../../services/sweet-alert.service';
import {
  Prompt,
  PromptLink,
  Course,
  ActivityType,
  BusinessUnit,
  Discipline,
} from '../../models/ia-corrections.models';
import {
  MultiSelectOption,
  MultiSelectDropdownComponent,
} from '../shared/multi-select-dropdown/multi-select-dropdown.component';
import { PromptDetailModalComponent } from '../shared/prompt-detail-modal/prompt-detail-modal.component';

@Component({
  selector: 'app-prompt-linking-tab',
  standalone: true,
  imports: [CommonModule, FormsModule, MultiSelectDropdownComponent, PromptDetailModalComponent],
  templateUrl: './prompt-linking-tab.component.html',
  styleUrls: ['./prompt-linking-tab.component.css'],
})
export class PromptLinkingTabComponent implements OnInit {
  private promptLinkingService = inject(PromptLinkingService);
  private promptService = inject(PromptService);
  private sweetAlertService = inject(SweetAlertService);

  prompts = signal<Prompt[]>([]);
  disciplines = signal<Discipline[]>([]); // v4: Show disciplines instead of courses
  links = signal<PromptLink[]>([]);
  businessUnits = signal<BusinessUnit[]>([]);
  activityTypes = signal<ActivityType[]>([]);
  courses = signal<Course[]>([]);

  // v4: Filtros Hierárquicos (D.1)
  selectedUnits = signal<number[]>([]);
  selectedClusters = signal<number[]>([]);
  selectedCourses = signal<number[]>([]);
  selectedDisciplines = signal<number[]>([]);
  selectedActivityTypes = signal<string[]>([]);
  selectedPromptIds = signal<string[]>([]);

  unitOptions = computed<MultiSelectOption[]>(() =>
    this.businessUnits().map((u) => ({ value: u.id, label: u.name })),
  );

  // v4: Options derived from hierarchy
  clusterOptions = computed<MultiSelectOption[]>(() => {
    const units = this.selectedUnits();
    const filtered = this.disciplines().filter(
      (d) => units.length === 0 || units.includes(d.businessUnitId),
    );
    const uniqueClusters = Array.from(new Set(filtered.map((d) => d.clusterId)));
    return uniqueClusters
      .map((id) => {
        const d = filtered.find((x) => x.clusterId === id);
        return { value: id, label: d ? d.clusterName : '' };
      })
      .filter((o) => o.label);
  });

  courseOptions = computed<MultiSelectOption[]>(() => {
    const clusters = this.selectedClusters();
    const filtered = this.disciplines().filter(
      (d) => clusters.length === 0 || clusters.includes(d.clusterId),
    );
    const uniqueCourses = Array.from(new Set(filtered.map((d) => d.courseId)));
    return uniqueCourses
      .map((id) => {
        const d = filtered.find((x) => x.courseId === id);
        return { value: id, label: d ? d.courseName : '' };
      })
      .filter((o) => o.label);
  });

  disciplineOptions = computed<MultiSelectOption[]>(() => {
    const courses = this.selectedCourses();
    return this.disciplines()
      .filter((d) => courses.length === 0 || courses.includes(d.courseId))
      .map((d) => ({ value: d.id, label: d.name }));
  });

  activityTypeOptions = computed<MultiSelectOption[]>(() => {
    return this.activityTypes().map((a) => ({ value: a.name, label: a.name }));
  });

  promptOptions = computed<MultiSelectOption[]>(() => {
    const units = this.selectedUnits();
    const activities = this.selectedActivityTypes();

    return this.prompts()
      .filter((p) => {
        const matchUnit = units.length === 0 || units.includes(p.businessUnitId);
        const matchActivity = activities.length === 0 || activities.includes(p.activityTypeName);
        return matchUnit && matchActivity;
      })
      .map((p) => ({ value: p.id, label: p.title }));
  });

  // v4: Vinculação em Massa (D.4)
  bulkPromptId = signal<string>('');
  selectedDisciplineIds = signal<Set<number>>(new Set());

  // Modal (Fase D.4)
  isModalOpen = signal(false);
  modalPrompt = signal<Prompt | null>(null);

  // Paginação (Fase D.5)
  currentPage = signal<number>(1);
  itemsPerPage = signal<number>(25);

  filteredDisciplines = computed(() => {
    // v4: This now filters the full list of disciplines (D.1)
    // Note: The "Pesquisar" button is needed to trigger filtering on the full set, not computed on the fly.
    // However, for the table display we usually computed(). The requirement says "filtros NÃO aplicam filtragem imediatamente".
    // So we will use a signal for the "searched" data and computed for the "paginated" view of that searched data.
    return this.disciplines(); // Placeholder until search is implemented
  });

  // We need a signal for "displayed records" vs "all records"
  displayedRecords = signal<Discipline[]>([]);

  paginatedRecords = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return this.displayedRecords().slice(start, end);
  });

  totalPages = computed(() => {
    return Math.max(1, Math.ceil(this.displayedRecords().length / this.itemsPerPage()));
  });

  ngOnInit() {
    this.promptService.getBusinessUnits().subscribe((u) => this.businessUnits.set(u));
    this.promptService.getActivityTypes().subscribe((a) => this.activityTypes.set(a));
    this.promptService.getPrompts().subscribe((p) => this.prompts.set(p));
    this.loadAllData();
  }

  loadAllData() {
    // v4: Load disciplines instead of courses
    this.promptLinkingService.getAllDisciplines().subscribe((disciplines) => {
      this.disciplines.set(disciplines);
      this.displayedRecords.set(disciplines); // Initial load
    });
    this.promptLinkingService.getAllLinks().subscribe((links) => this.links.set(links));
  }

  // v4: D.2 Botão Pesquisar
  onSearch() {
    this.sweetAlertService.showLoading('Buscando registros...');
    this.promptLinkingService
      .getDisciplinesByFilters(
        this.selectedUnits(),
        this.selectedClusters(),
        this.selectedCourses(),
      )
      .subscribe({
        next: (data) => {
          // Further filter by Disciplines and Activity Types locally if needed, or assume service handles it
          // The service filters by unit/cluster/course.
          // We still need to filter by selectedDisciplines and selectedActivityTypes and selectedPromptIds locally.

          let filtered = data;
          const discIds = this.selectedDisciplines();
          const actTypes = this.selectedActivityTypes();
          const promptIds = this.selectedPromptIds();

          if (discIds.length > 0) {
            filtered = filtered.filter((d) => discIds.includes(d.id));
          }
          if (actTypes.length > 0) {
            // Filter by linked activity
            filtered = filtered.filter((d) => {
              const link = this.getLinkedPrompt(d.id);
              return link && actTypes.includes(link.activityTypeName);
            });
          }
          if (promptIds.length > 0) {
            filtered = filtered.filter((d) => {
              const link = this.getLinkedPrompt(d.id);
              return link && promptIds.includes(link.promptId);
            });
          }

          this.displayedRecords.set(filtered);
          this.currentPage.set(1);
          this.sweetAlertService.closeLoading();
        },
        error: () => this.sweetAlertService.closeLoading(),
      });
  }

  getLinkedPrompt(disciplineId: number): PromptLink | undefined {
    return this.links().find((l) => l.disciplineId === disciplineId);
  }

  toggleDisciplineSelection(disciplineId: number) {
    this.selectedDisciplineIds.update((set) => {
      const newSet = new Set(set);
      if (newSet.has(disciplineId)) newSet.delete(disciplineId);
      else newSet.add(disciplineId);
      return newSet;
    });
  }

  toggleAllVisible(event: any) {
    const checked = event.target.checked;
    if (checked) {
      const allIds = this.paginatedRecords().map((d) => d.id);
      this.selectedDisciplineIds.set(new Set(allIds));
    } else {
      this.selectedDisciplineIds.set(new Set());
    }
  }

  // v4: D.4 Lógica Inteligente de Vinculação em Massa
  async onBulkLink() {
    const promptId = this.bulkPromptId();
    const prompt = this.prompts().find((p) => p.id === promptId);
    if (!prompt) return;

    const selectedCount = this.selectedDisciplineIds().size;
    const filteredCount = this.displayedRecords().length;

    const targets =
      selectedCount > 0
        ? Array.from(this.selectedDisciplineIds())
        : this.displayedRecords().map((d) => d.id);

    const count = targets.length;
    const isSelection = selectedCount > 0;
    const label = isSelection ? `${count} selecionados` : `${count} filtrados`;

    const confirmed = await this.sweetAlertService.confirmAction(
      'Confirmar Vinculação',
      `Deseja vincular o prompt "${prompt.title}" a ${label}?`,
    );

    if (!confirmed) return;

    this.sweetAlertService.showLoading('Vinculando...');
    this.promptLinkingService
      .linkPromptToDisciplines(prompt.id, prompt.title, targets, prompt.activityTypeName)
      .subscribe({
        next: (result) => {
          this.sweetAlertService.closeLoading();
          this.sweetAlertService.showSuccess(
            'Concluído!',
            `${result.created.length} registros vinculados. ${result.skipped} registros já possuíam este prompt.`,
          );
          this.loadAllData(); // Reload links
          this.selectedDisciplineIds.set(new Set());
        },
        error: (err) => {
          this.sweetAlertService.closeLoading();
          this.sweetAlertService.showError('Erro', err.message);
        },
      });
  }

  openPromptModal(promptId: string) {
    const prompt = this.prompts().find((p) => p.id === promptId);
    if (prompt) {
      this.modalPrompt.set(prompt);
      this.isModalOpen.set(true);
    }
  }

  onSaveObservations(data: { id: string; observations: string }) {
    this.promptService.updatePromptObservations(data.id, data.observations).subscribe(() => {
      this.prompts.update((list) =>
        list.map((p) => (p.id === data.id ? { ...p, observations: data.observations } : p)),
      );
      alert('Observações atualizadas!');
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
