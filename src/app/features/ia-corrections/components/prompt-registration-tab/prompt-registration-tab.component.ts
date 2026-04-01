import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PromptService } from '../../services/prompt.service';
import { Prompt, BusinessUnit, ActivityType } from '../../models/ia-corrections.models';

@Component({
  selector: 'app-prompt-registration-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prompt-registration-tab.component.html',
  styleUrls: ['./prompt-registration-tab.component.css'],
})
export class PromptRegistrationTabComponent implements OnInit {
  private promptService = inject(PromptService);

  prompts = signal<Prompt[]>([]);
  businessUnits = signal<BusinessUnit[]>([]);
  activityTypes = signal<ActivityType[]>([]);

  selectedPrompt = signal<Prompt | null>(null);
  isLoading = signal<boolean>(true);
  isSaving = signal<boolean>(false);
  isEditing = signal<boolean>(false);
  isNewPrompt = signal<boolean>(false);
  formDirty = signal<boolean>(false);

  // Filtros da lista (RN05.3)
  filterUnitId = signal<number | null>(null);
  filterActivityTypeId = signal<number | null>(null);
  filterStatus = signal<string[]>(['Ativo']); // Default: Ativo marcado

  filteredPrompts = computed(() => {
    const list = this.prompts();
    const unitId = this.filterUnitId();
    const activityId = this.filterActivityTypeId();
    const statusArr = this.filterStatus();

    if (statusArr.length === 0) return []; // RN05.3: Nenhuma opção selecionada = nenhum prompt

    return list.filter((p) => {
      const matchUnit = !unitId || p.businessUnitId === unitId;
      const matchActivity = !activityId || p.activityTypeId === activityId;
      const matchStatus = statusArr.includes(p.status);
      return matchUnit && matchActivity && matchStatus;
    });
  });

  formData = {
    id: '',
    title: '',
    bodyEvaluation: '',
    bodyFeedback: '',
    businessUnitId: null as number | null,
    businessUnitName: '',
    activityTypeId: null as number | null,
    activityTypeName: '',
    status: 'Ativo' as 'Ativo' | 'Inativo',
    observations: '',
  };

  originalFormData: any = null;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);
    this.promptService.getPrompts().subscribe((prompts) => {
      this.prompts.set(prompts);
      this.isLoading.set(false);
    });
    this.promptService.getBusinessUnits().subscribe((units) => {
      this.businessUnits.set(units);
    });
    this.promptService.getActivityTypes().subscribe((types) => {
      this.activityTypes.set(types);
    });
  }

  createNew() {
    if (this.formDirty()) {
      const confirm = window.confirm('Você tem alterações não salvas. Deseja descartá-las?');
      if (!confirm) return;
    }

    this.resetForm();
    this.isNewPrompt.set(true);
    this.isEditing.set(true);
    this.formDirty.set(false);
    this.selectedPrompt.set(null);
    this.originalFormData = { ...this.formData };
  }

  selectPrompt(id: string) {
    if (this.formDirty()) {
      const confirm = window.confirm('Você tem alterações não salvas. Deseja descartá-las?');
      if (!confirm) return;
    }

    const prompt = this.prompts().find((p) => p.id === id);
    if (prompt) {
      this.selectedPrompt.set(prompt);
      this.formData = {
        id: prompt.id,
        title: prompt.title,
        bodyEvaluation: (prompt as any).bodyEvaluation || (prompt as any).body || '',
        bodyFeedback: (prompt as any).bodyFeedback || '',
        businessUnitId: prompt.businessUnitId,
        businessUnitName: prompt.businessUnitName,
        activityTypeId: prompt.activityTypeId,
        activityTypeName: prompt.activityTypeName,
        status: prompt.status || 'Ativo',
        observations: prompt.observations || '',
      };
      this.isNewPrompt.set(false);
      this.isEditing.set(true);
      this.formDirty.set(false);
      this.originalFormData = { ...this.formData };
    }
  }

  onBusinessUnitChange(unitId: number) {
    const unit = this.businessUnits().find((u) => u.id === unitId);
    if (unit) {
      this.formData.businessUnitName = unit.name;
      this.checkFormDirty();
    }
  }

  onActivityTypeChange(activityId: number) {
    const activity = this.activityTypes().find((a) => a.id === activityId);
    if (activity) {
      this.formData.activityTypeName = activity.name;
      this.checkFormDirty();
    }
  }

  toggleStatusFilter(status: string) {
    this.filterStatus.update((current) => {
      if (current.includes(status)) {
        return current.filter((s) => s !== status);
      }
      return [...current, status];
    });
  }

  togglePromptStatus() {
    this.formData.status = this.formData.status === 'Ativo' ? 'Inativo' : 'Ativo';
    this.checkFormDirty();
  }

  saveComment() {
    if (!this.selectedPrompt()) return;
    this.isSaving.set(true);
    this.promptService
      .updatePromptObservations(this.selectedPrompt()!.id, this.formData.observations)
      .subscribe({
        next: (updated) => {
          this.prompts.update((list) => list.map((p) => (p.id === updated.id ? updated : p)));
          this.originalFormData.observations = updated.observations;
          this.isSaving.set(false);
          this.checkFormDirty();
          alert('Comentário salvo com sucesso!');
        },
        error: () => {
          this.isSaving.set(false);
          alert('Erro ao salvar comentário.');
        },
      });
  }

  checkFormDirty() {
    const current = JSON.stringify({
      title: this.formData.title,
      bodyEvaluation: this.formData.bodyEvaluation,
      bodyFeedback: this.formData.bodyFeedback,
      businessUnitId: this.formData.businessUnitId,
      activityTypeId: this.formData.activityTypeId,
      status: this.formData.status,
      observations: this.formData.observations,
    });
    const original = JSON.stringify({
      title: this.originalFormData.title,
      bodyEvaluation: this.originalFormData.bodyEvaluation,
      bodyFeedback: this.originalFormData.bodyFeedback,
      businessUnitId: this.originalFormData.businessUnitId,
      activityTypeId: this.originalFormData.activityTypeId,
      status: this.originalFormData.status,
      observations: this.originalFormData.observations,
    });
    this.formDirty.set(current !== original);
  }

  isFormValid(): boolean {
    return !!(
      this.formData.title?.trim() &&
      this.formData.bodyEvaluation?.trim() &&
      this.formData.bodyFeedback?.trim() &&
      this.formData.businessUnitId &&
      this.formData.activityTypeId
    );
  }

  save() {
    if (!this.isFormValid()) return;

    this.isSaving.set(true);
    const payload = {
      title: this.formData.title,
      bodyEvaluation: this.formData.bodyEvaluation,
      bodyFeedback: this.formData.bodyFeedback,
      businessUnitId: this.formData.businessUnitId!,
      businessUnitName: this.formData.businessUnitName,
      activityTypeId: this.formData.activityTypeId!,
      activityTypeName: this.formData.activityTypeName,
      status: this.formData.status || 'Ativo',
      observations: this.formData.observations || '',
    };

    const operation = this.isNewPrompt()
      ? this.promptService.createPrompt(payload)
      : this.promptService.updatePrompt(this.formData.id, payload);

    operation.subscribe({
      next: (savedPrompt) => {
        if (this.isNewPrompt()) {
          this.prompts.update((list) => [...list, savedPrompt]);
        } else {
          this.prompts.update((list) =>
            list.map((p) => (p.id === savedPrompt.id ? savedPrompt : p)),
          );
        }
        this.selectedPrompt.set(savedPrompt);
        this.isSaving.set(false);
        this.formDirty.set(false);
        this.originalFormData = { ...this.formData };
        alert('Prompt salvo com sucesso!');
      },
      error: () => {
        this.isSaving.set(false);
        alert('Erro ao salvar prompt.');
      },
    });
  }

  cancelEdit() {
    if (this.formDirty()) {
      const confirm = window.confirm('Você tem alterações não salvas. Deseja descartá-las?');
      if (!confirm) return;
    }

    this.isEditing.set(false);
    this.isNewPrompt.set(false);
    this.selectedPrompt.set(null);
    this.formDirty.set(false);
    this.resetForm();
  }

  resetForm() {
    this.formData = {
      id: '',
      title: '',
      bodyEvaluation: '',
      bodyFeedback: '',
      businessUnitId: null,
      businessUnitName: '',
      activityTypeId: null,
      activityTypeName: '',
      status: 'Ativo',
      observations: '',
    };
    this.originalFormData = { ...this.formData };
  }

  hasUnsavedChanges(): boolean {
    return this.formDirty();
  }
}
