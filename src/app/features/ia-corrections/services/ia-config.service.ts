import { Injectable, signal } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

export interface BusinessUnit {
  id: number;
  name: string;
}

export interface ActivityType {
  id: number;
  name: string;
}

export interface SubjectItem {
  id: number;
  name: string;
  clusterName?: string;
  courseName?: string;
}

export interface AuditLog {
  id: string;
  unitName: string;
  activityName: string;
  clusterName?: string;
  courseName?: string;
  disciplineName?: string;
  promptName?: string;
  activatedBy: string;
  activatedAt: Date;
  status: 'Ativo' | 'Inativo';
  parameters: any;
}

export interface Cluster {
  id: number;
  name: string;
}

export interface Course {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class IaConfigMockService {

  // Simulating Database State
  private activeConfigs: AuditLog[] = [
    {
      id: 'CFG-001',
      unitName: 'Uniasselvi',
      activityName: 'Desafio Profissional',
      activatedBy: 'USR-LuanM',
      activatedAt: new Date(2026, 0, 15, 10, 30),
      status: 'Ativo',
      parameters: { globalIa: true, autoPublish: false },
      clusterName: 'Cluster Sul',
      courseName: 'Engenharia de Software',
      disciplineName: 'Algoritmos',
      promptName: 'Prompt Corretor Padrão'
    },
    {
      id: 'CFG-002',
      unitName: 'Unicesumar',
      activityName: 'Resenha',
      activatedBy: 'USR-TaessaV',
      activatedAt: new Date(2026, 0, 20, 14, 15),
      status: 'Ativo',
      parameters: { globalIa: true, autoPublish: true, threshold: 75 },
      clusterName: 'Cluster Norte',
      courseName: 'Administração',
      disciplineName: 'Gestão de Projetos',
      promptName: 'Prompt Resenha Admin'
    }
  ];

  constructor() { }

  getBusinessUnits(): Observable<BusinessUnit[]> {
    return of([
      { id: 1, name: 'Uniasselvi' },
      { id: 2, name: 'Unicesumar' }
    ]).pipe(delay(300));
  }

  getActivities(unitId: number): Observable<ActivityType[]> {
    return of([
      { id: 1, name: 'Desafio Profissional' },
      { id: 2, name: 'Resenha' },
      { id: 3, name: 'Prova (Avaliação Final)' },
      { id: 4, name: 'MAPA' }
    ]).pipe(delay(300));
  }

  getClusters(unitId: number): Observable<Cluster[]> {
    return of([
      { id: 1, name: 'Cluster Norte' },
      { id: 2, name: 'Cluster Sul' },
      { id: 3, name: 'Cluster Leste' },
      { id: 4, name: 'Cluster Oeste' }
    ]).pipe(delay(300));
  }

  getCoursesByClusters(clusterIds: number[]): Observable<Course[]> {
    if (clusterIds.length === 0) return of([]);
    // In a real app, this would be a filtered query. Here we just return mock data.
    return of([
      { id: 1, name: 'Engenharia de Software' },
      { id: 2, name: 'Administração' },
      { id: 3, name: 'Psicologia' },
      { id: 4, name: 'Medicina' },
      { id: 5, name: 'Arquitetura' },
      { id: 6, name: 'Direito' }
    ]).pipe(delay(300));
  }

  getSubjects(unitId: number, activityId: number): Observable<SubjectItem[]> {
    // Generate mock subjects
    const subjects: SubjectItem[] = [];
    for (let i = 1; i <= 25; i++) {
        subjects.push({ id: i, name: `Disciplina Demo ${unitId}-${activityId}-${i}` });
    }
    return of(subjects).pipe(delay(500));
  }

  getDisciplinesByCourses(courseIds: number[]): Observable<SubjectItem[]> {
    if (courseIds.length === 0) return of([]);
     return of([
      { id: 1, name: 'Algoritmos', clusterName: 'Cluster Sul', courseName: 'Engenharia de Software' },
      { id: 2, name: 'Banco de Dados', clusterName: 'Cluster Sul', courseName: 'Engenharia de Software' },
      { id: 3, name: 'Gestão de Projetos', clusterName: 'Cluster Norte', courseName: 'Administração' },
      { id: 4, name: 'Anatomia', clusterName: 'Cluster Leste', courseName: 'Medicina' },
      { id: 5, name: 'Cálculo I', clusterName: 'Cluster Sul', courseName: 'Engenharia de Software' },
      { id: 6, name: 'Direito Civil', clusterName: 'Cluster Oeste', courseName: 'Direito' }
    ]).pipe(delay(300));
  }

  getAuditLogs(): Observable<AuditLog[]> {
    return of([...this.activeConfigs]).pipe(delay(400));
  }

  saveConfig(payload: any): Observable<{success: boolean, id: string}> {
    const newRecord: AuditLog = {
      id: `CFG-00${this.activeConfigs.length + 1}`,
      unitName: payload.unitId === '1' ? 'Uniasselvi' : 'Unicesumar',
      activityName: 'Atividade Configurda', // Mapped loosely for demo
      clusterName: payload.clusterId ? 'Cluster Norte' : undefined,
      courseName: payload.courseId ? 'Engenharia de Software' : undefined,
      disciplineName: payload.disciplineId ? 'Algoritmos' : undefined,
      activatedBy: 'USR-Current',
      activatedAt: new Date(),
      status: 'Ativo',
      parameters: payload
    };
    
    this.activeConfigs.unshift(newRecord); // Add to top

    return of({ success: true, id: newRecord.id }).pipe(delay(800));
  }

  disableConfig(id: string): Observable<boolean> {
    const log = this.activeConfigs.find(c => c.id === id);
    if (log) {
      log.status = 'Inativo';
      return of(true).pipe(delay(300));
    }
    return of(false);
  }

  updateStatuses(ids: string[], newStatus: 'Ativo' | 'Inativo'): Observable<boolean> {
    this.activeConfigs.filter(c => ids.includes(c.id)).forEach(c => c.status = newStatus);
    return of(true).pipe(delay(400));
  }
}
