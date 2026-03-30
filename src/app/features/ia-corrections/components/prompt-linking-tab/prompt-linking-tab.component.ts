import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PromptLinkingService } from '../../services/prompt-linking.service';
import { PromptService } from '../../services/prompt.service';
import { Prompt, PromptLink, Course } from '../../models/ia-corrections.models';

@Component({
  selector: 'app-prompt-linking-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prompt-linking-tab.component.html',
  styleUrls: ['./prompt-linking-tab.component.css'],
})
export class PromptLinkingTabComponent implements OnInit {
  private promptLinkingService = inject(PromptLinkingService);
  private promptService = inject(PromptService);

  prompts = signal<Prompt[]>([]);
  courses = signal<Course[]>([]);
  links = signal<PromptLink[]>([]);

  selectedPromptId: string | null = null;
  selectedPrompt = computed(
    () => this.prompts().find((p) => p.id === this.selectedPromptId) || null,
  );

  // Filtros
  filterCluster = '';
  filterCourse = '';

  // Paginação
  currentPage = signal<number>(1);
  itemsPerPage = signal<number>(100);

  filteredCourses = computed(() => {
    let data = this.courses();
    if (this.filterCluster) {
      data = data.filter((c) =>
        c.clusterName.toLowerCase().includes(this.filterCluster.toLowerCase()),
      );
    }
    if (this.filterCourse) {
      data = data.filter((c) => c.name.toLowerCase().includes(this.filterCourse.toLowerCase()));
    }
    return data;
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
    this.promptService.getPrompts().subscribe((prompts) => {
      this.prompts.set(prompts);
    });
    this.loadAllData();
  }

  loadAllData() {
    this.promptLinkingService.getAllCourses().subscribe((courses) => {
      this.courses.set(courses);
    });
    this.promptLinkingService.getAllLinks().subscribe((links) => {
      this.links.set(links);
    });
  }

  onPromptChange(promptId: string) {
    this.selectedPromptId = promptId;
    this.currentPage.set(1);

    if (promptId) {
      // Filtrar cursos pela unidade do prompt
      const prompt = this.prompts().find((p) => p.id === promptId);
      if (prompt) {
        this.promptLinkingService.getCoursesByUnit(prompt.businessUnitId).subscribe((courses) => {
          this.courses.set(courses);
        });
      }
    } else {
      this.loadAllData();
    }
  }

  getLinkedPrompt(courseId: number): PromptLink | undefined {
    const prompt = this.selectedPrompt();
    if (!prompt) return undefined;

    // Mostra o vínculo se ele for do mesmo Tipo de Atividade do prompt selecionado
    return this.links().find(
      (l) => l.courseId === courseId && l.activityTypeName === prompt.activityTypeName,
    );
  }

  linkPrompt(courseId: number) {
    const prompt = this.selectedPrompt();
    if (!prompt) return;

    if (!confirm(`Vincular o prompt "${prompt.title}" ao curso selecionado?`)) return;

    this.promptLinkingService
      .linkPromptToCourse(prompt.id, prompt.title, courseId, prompt.activityTypeName)
      .subscribe({
        next: (newLink) => {
          this.links.update((list) => [...list, newLink]);
          alert('Vínculo criado com sucesso!');
        },
        error: (err) => {
          alert(err.message || 'Erro ao criar vínculo.');
        },
      });
  }

  unlinkPrompt(linkId: string) {
    if (!confirm('Remover o vínculo deste curso?')) return;

    this.promptLinkingService.unlinkPromptFromCourse(linkId).subscribe({
      next: () => {
        this.links.update((list) => list.filter((l) => l.id !== linkId));
        alert('Vínculo removido.');
      },
      error: () => {
        alert('Erro ao remover vínculo.');
      },
    });
  }

  openChangePromptModal(course: Course) {
    alert(
      'Funcionalidade de alteração em desenvolvimento. Por enquanto, remova o vínculo e crie um novo.',
    );
  }

  prevPage() {
    if (this.currentPage() > 1) this.currentPage.set(this.currentPage() - 1);
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) this.currentPage.set(this.currentPage() + 1);
  }
}
