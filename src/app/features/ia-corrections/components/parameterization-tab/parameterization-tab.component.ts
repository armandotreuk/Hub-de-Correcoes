import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IaConfigMockService, BusinessUnit, ActivityType, SubjectItem, Cluster, Course } from '../../services/ia-config.service';

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
  clusters = signal<Cluster[]>([]);
  courses = signal<Course[]>([]);
  subjects = signal<SubjectItem[]>([]);
  
  selectedUnit = signal<string>('');
  selectedActivity = signal<string>('');
  selectedClusterIds = signal<Set<number>>(new Set());
  selectedCourseIds = signal<Set<number>>(new Set());

  // Switches (US02, US05)
  isGlobalIaEnabled = signal<boolean>(false);
  isAutoPublishEnabled = signal<boolean>(false);

  // Inputs (US06, new)
  thresholdPercentage = signal<number>(70);
  publishDays = signal<number | null>(null);

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
    this.selectedClusterIds.set(new Set());
    this.selectedCourseIds.set(new Set());
    this.subjects.set([]);
    
    if (value && this.selectedUnit()) {
      this.service.getClusters(parseInt(this.selectedUnit())).subscribe(res => this.clusters.set(res));
    } else {
      this.clusters.set([]);
    }
  }

  toggleCluster(id: number) {
    const set = new Set(this.selectedClusterIds());
    if (set.has(id)) set.delete(id);
    else set.add(id);
    this.selectedClusterIds.set(set);
    
    // Cascade reset
    this.selectedCourseIds.set(new Set());
    this.subjects.set([]);

    if (set.size > 0) {
      this.service.getCoursesByClusters(Array.from(set)).subscribe(res => this.courses.set(res));
    } else {
      this.courses.set([]);
    }
  }

  toggleCourse(id: number) {
    const set = new Set(this.selectedCourseIds());
    if (set.has(id)) set.delete(id);
    else set.add(id);
    this.selectedCourseIds.set(set);

    if (set.size > 0) {
      this.isLoadingSubjects.set(true);
      this.service.getDisciplinesByCourses(Array.from(set)).subscribe(res => {
        this.subjects.set(res);
        this.selectedSubjectIds.set(new Set());
        this.isLoadingSubjects.set(false);
      });
    } else {
      this.subjects.set([]);
    }
  }

  toggleAllClusters() {
    const current = this.selectedClusterIds();
    const all = this.clusters();
    if (current.size === all.length) {
      this.selectedClusterIds.set(new Set());
      this.courses.set([]);
    } else {
      const next = new Set(all.map(c => c.id));
      this.selectedClusterIds.set(next);
      this.service.getCoursesByClusters(Array.from(next)).subscribe(res => this.courses.set(res));
    }
    this.selectedCourseIds.set(new Set());
    this.subjects.set([]);
  }

  toggleAllCourses() {
    const current = this.selectedCourseIds();
    const all = this.courses();
    if (current.size === all.length) {
      this.selectedCourseIds.set(new Set());
      this.subjects.set([]);
    } else {
      const next = new Set(all.map(c => c.id));
      this.selectedCourseIds.set(next);
      this.isLoadingSubjects.set(true);
      this.service.getDisciplinesByCourses(Array.from(next)).subscribe(res => {
        this.subjects.set(res);
        this.selectedSubjectIds.set(new Set());
        this.isLoadingSubjects.set(false);
      });
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
      clusterIds: Array.from(this.selectedClusterIds()),
      courseIds: Array.from(this.selectedCourseIds()),
      globalIa: this.isGlobalIaEnabled(),
      autoPublish: this.isAutoPublishEnabled(),
      threshold: this.isAutoPublishEnabled() ? this.thresholdPercentage() : null,
      publishDays: this.publishDays(),
      subjectsCount: this.selectedSubjectIds().size
    };

    this.service.saveConfig(payload).subscribe(res => {
      this.isSaving.set(false);
      if(res.success) {
         alert('Configuração salva com Sucesso! (ID: ' + res.id + ')');
         // Clean up form
         this.selectedUnit.set('');
         this.onUnitChange('');
         this.publishDays.set(null);
      }
    });
  }
}
