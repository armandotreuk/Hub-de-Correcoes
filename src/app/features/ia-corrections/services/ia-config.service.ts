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
}

export interface AuditLog {
  id: string;
  unitName: string;
  activityName: string;
  activatedBy: string;
  activatedAt: Date;
  status: 'Ativo' | 'Inativo';
  parameters: any;
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
      parameters: { globalIa: true, autoPublish: false }
    },
    {
      id: 'CFG-002',
      unitName: 'Unicesumar',
      activityName: 'Resenha',
      activatedBy: 'USR-TaessaV',
      activatedAt: new Date(2026, 0, 20, 14, 15),
      status: 'Ativo',
      parameters: { globalIa: true, autoPublish: true, threshold: 75 }
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

  getSubjects(unitId: number, activityId: number): Observable<SubjectItem[]> {
    // Generate mock subjects
    const subjects: SubjectItem[] = [];
    for (let i = 1; i <= 25; i++) {
        subjects.push({ id: i, name: `Disciplina Demo ${unitId}-${activityId}-${i}` });
    }
    return of(subjects).pipe(delay(500));
  }

  getAuditLogs(): Observable<AuditLog[]> {
    return of([...this.activeConfigs]).pipe(delay(400));
  }

  saveConfig(payload: any): Observable<{success: boolean, id: string}> {
    const newRecord: AuditLog = {
      id: `CFG-00${this.activeConfigs.length + 1}`,
      unitName: payload.unitId === '1' ? 'Uniasselvi' : 'Unicesumar',
      activityName: 'Atividade Configurda', // Mapped loosely for demo
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
}
