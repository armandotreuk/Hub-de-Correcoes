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

  formData = {
    id: '',
    title: '',
    body: '',
    businessUnitId: null as number | null,
    businessUnitName: '',
    activityTypeId: null as number | null,
    activityTypeName: '',
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
        body: prompt.body,
        businessUnitId: prompt.businessUnitId,
        businessUnitName: prompt.businessUnitName,
        activityTypeId: prompt.activityTypeId,
        activityTypeName: prompt.activityTypeName,
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

  checkFormDirty() {
    const current = JSON.stringify({
      title: this.formData.title,
      body: this.formData.body,
      businessUnitId: this.formData.businessUnitId,
      activityTypeId: this.formData.activityTypeId,
    });
    const original = JSON.stringify({
      title: this.originalFormData.title,
      body: this.originalFormData.body,
      businessUnitId: this.originalFormData.businessUnitId,
      activityTypeId: this.originalFormData.activityTypeId,
    });
    this.formDirty.set(current !== original);
  }

  isFormValid(): boolean {
    return !!(
      this.formData.title?.trim() &&
      this.formData.body?.trim() &&
      this.formData.businessUnitId &&
      this.formData.activityTypeId
    );
  }

  save() {
    if (!this.isFormValid()) return;

    this.isSaving.set(true);
    const payload = {
      title: this.formData.title,
      body: this.formData.body,
      businessUnitId: this.formData.businessUnitId!,
      businessUnitName: this.formData.businessUnitName,
      activityTypeId: this.formData.activityTypeId!,
      activityTypeName: this.formData.activityTypeName,
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
      body: '',
      businessUnitId: null,
      businessUnitName: '',
      activityTypeId: null,
      activityTypeName: '',
    };
    this.originalFormData = { ...this.formData };
  }

  hasUnsavedChanges(): boolean {
    return this.formDirty();
  }
}
