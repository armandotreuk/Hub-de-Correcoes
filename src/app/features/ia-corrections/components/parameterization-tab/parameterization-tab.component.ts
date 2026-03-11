import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IaConfigMockService, BusinessUnit, ActivityType, SubjectItem } from '../../services/ia-config.service';

@Component({
  selector: 'app-parameterization-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './parameterization-tab.component.html',
  styleUrls: ['./parameterization-tab.component.css']
})
export class ParameterizationTabComponent implements OnInit {
  private service = inject(IaConfigMockService);

  // State Signals (US01)
  units = signal<BusinessUnit[]>([]);
  activities = signal<ActivityType[]>([]);
  subjects = signal<SubjectItem[]>([]);
  
  selectedUnit = signal<string>('');
  selectedActivity = signal<string>('');

  // Switches (US02, US05)
  isGlobalIaEnabled = signal<boolean>(false);
  isAutoPublishEnabled = signal<boolean>(false);

  // Inputs (US06)
  thresholdPercentage = signal<number>(70);

  // List Management (US03, US04)
  selectedSubjectIds = signal<Set<number>>(new Set());

  // Loading States
  isLoadingSubjects = signal<boolean>(false);
  isSaving = signal<boolean>(false);

  // Computed Values
  allSelected = computed(() => {
    const list = this.subjects();
    return list.length > 0 && this.selectedSubjectIds().size === list.length;
  });

  ngOnInit() {
    this.service.getBusinessUnits().subscribe(res => this.units.set(res));
  }

  onUnitChange(value: string) {
    this.selectedUnit.set(value);
    this.selectedActivity.set(''); // Reset cascade
    this.subjects.set([]);
    
    if (value) {
      this.service.getActivities(parseInt(value)).subscribe(res => this.activities.set(res));
    } else {
      this.activities.set([]);
    }
  }

  onActivityChange(value: string) {
    this.selectedActivity.set(value);
    const unitId = this.selectedUnit();
    
    if (value && unitId) {
      this.isLoadingSubjects.set(true);
      this.service.getSubjects(parseInt(unitId), parseInt(value)).subscribe(res => {
        this.subjects.set(res);
        this.selectedSubjectIds.set(new Set()); // Reset selections
        this.isLoadingSubjects.set(false);
      });
    } else {
      this.subjects.set([]);
    }
  }

  // List Actions (US03, US04)
  toggleSubject(id: number) {
    const set = new Set(this.selectedSubjectIds());
    if (set.has(id)) {
      set.delete(id);
    } else {
      set.add(id);
    }
    this.selectedSubjectIds.set(set);
  }

  toggleAll(checked: boolean) {
    if (checked) {
      const allIds = this.subjects().map(s => s.id);
      this.selectedSubjectIds.set(new Set(allIds));
    } else {
      this.selectedSubjectIds.set(new Set());
    }
  }

  // Save Config
  onSave() {
    if (!this.selectedUnit() || !this.selectedActivity()) return;

    this.isSaving.set(true);
    const payload = {
      unitId: this.selectedUnit(),
      activityId: this.selectedActivity(),
      globalIa: this.isGlobalIaEnabled(),
      autoPublish: this.isAutoPublishEnabled(),
      threshold: this.isAutoPublishEnabled() ? this.thresholdPercentage() : null,
      subjectsCount: this.selectedSubjectIds().size
    };

    this.service.saveConfig(payload).subscribe(res => {
      this.isSaving.set(false);
      if(res.success) {
         alert('Configuração salva com Sucesso! (ID: ' + res.id + ')');
         // Clean up form
         this.selectedUnit.set('');
         this.onUnitChange('');
      }
    });
  }
}
