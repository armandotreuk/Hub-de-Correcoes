import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PromptLinkingService } from '../../services/prompt-linking.service';
import { PromptService } from '../../services/prompt.service';
import { Prompt, PromptLink, Course, ActivityType, BusinessUnit } from '../../models/ia-corrections.models';
import { MultiSelectOption, MultiSelectDropdownComponent } from '../shared/multi-select-dropdown/multi-select-dropdown.component';
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

  prompts = signal<Prompt[]>([]);
  courses = signal<Course[]>([]);
  links = signal<PromptLink[]>([]);
  businessUnits = signal<BusinessUnit[]>([]);
  activityTypes = signal<ActivityType[]>([]);

  // Filtros MultiSelect (Fase D.1)
  selectedUnits = signal<number[]>([]);
  selectedActivityTypes = signal<string[]>([]);
  selectedPromptIds = signal<string[]>([]);

  unitOptions = computed<MultiSelectOption[]>(() =>
    this.businessUnits().map((u) => ({ value: u.id, label: u.name })),
  );

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

  // Vinculação em Massa (Fase D.2)
  bulkPromptId = signal<string>('');
  selectedCourseIds = signal<Set<number>>(new Set());

  // Modal (Fase D.4)
  isModalOpen = signal(false);
  modalPrompt = signal<Prompt | null>(null);

  // Paginação (Fase D.5 - Padrão Auditoria)
  currentPage = signal<number>(1);
  itemsPerPage = signal<number>(25);

  filteredCourses = computed(() => {
    const data = this.courses();
    const units = this.selectedUnits();
    const activities = this.selectedActivityTypes();
    const promptIds = this.selectedPromptIds();

    return data.filter((c) => {
      const matchUnit = units.length === 0 || units.includes(c.businessUnitId);
      const link = this.getLinkedPrompt(c.id);

      const matchActivity = activities.length === 0 || (link && activities.includes(link.activityTypeName));
      const matchPrompt = promptIds.length === 0 || (link && promptIds.includes(link.promptId));

      return matchUnit && (activities.length === 0 || link || promptIds.length === 0) && matchActivity && matchPrompt;
    });
  });

  paginatedCourses = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return this.filteredCourses().slice(start, end);
  });

  totalPages = computed(() => {
    return Math.max(1, Math.ceil(this.filteredCourses().length / this.itemsPerPage()));
  });

  ngOnInit() {
    this.promptService.getBusinessUnits().subscribe((u) => this.businessUnits.set(u));
    this.promptService.getActivityTypes().subscribe((a) => this.activityTypes.set(a));
    this.promptService.getPrompts().subscribe((p) => this.prompts.set(p));
    this.loadAllData();
  }

  loadAllData() {
    this.promptLinkingService.getAllCourses().subscribe((courses) => this.courses.set(courses));
    this.promptLinkingService.getAllLinks().subscribe((links) => this.links.set(links));
  }

  getLinkedPrompt(courseId: number): PromptLink | undefined {
    return this.links().find((l) => l.courseId === courseId);
  }

  toggleCourseSelection(courseId: number) {
    this.selectedCourseIds.update((set) => {
      const newSet = new Set(set);
      if (newSet.has(courseId)) newSet.delete(courseId);
      else newSet.add(courseId);
      return newSet;
    });
  }

  toggleAllVisible(event: any) {
    const checked = event.target.checked;
    if (checked) {
      const allIds = this.paginatedCourses().map((c) => c.id);
      this.selectedCourseIds.set(new Set(allIds));
    } else {
      this.selectedCourseIds.set(new Set());
    }
  }

  linkSelectedCourses() {
    const promptId = this.bulkPromptId();
    const courseIds = Array.from(this.selectedCourseIds());
    const prompt = this.prompts().find((p) => p.id === promptId);

    if (!prompt || courseIds.length === 0) return;

    this.promptLinkingService
      .linkPromptToCourses(prompt.id, prompt.title, courseIds, prompt.activityTypeName)
      .subscribe({
        next: (newLinks) => {
          this.links.update((list) => [...list, ...newLinks]);
          this.selectedCourseIds.set(new Set());
          alert(`${newLinks.length} cursos vinculados com sucesso!`);
        },
        error: (err) => alert(err.message),
      });
  }

  linkPrompt(courseId: number) {
    const promptId = this.bulkPromptId(); // Usa o prompt selecionado no dropdown superior
    const prompt = this.prompts().find((p) => p.id === promptId);
    if (!prompt) {
      alert('Selecione um prompt no seletor superior para vincular.');
      return;
    }

    this.promptLinkingService
      .linkPromptToCourse(prompt.id, prompt.title, courseId, prompt.activityTypeName)
      .subscribe({
        next: (newLink) => {
          this.links.update((list) => [...list, newLink]);
          alert('Vínculo criado!');
        },
        error: (err) => alert(err.message),
      });
  }

  unlinkPrompt(linkId: string) {
    if (!confirm('Deseja remover este vínculo?')) return;
    this.promptLinkingService.unlinkPromptFromCourse(linkId).subscribe(() => {
      this.links.update((list) => list.filter((l) => l.id !== linkId));
      alert('Vínculo removido.');
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
