import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { CorrectionConfig } from '../models/ia-corrections.models';

@Injectable({ providedIn: 'root' })
export class CorrectionConfigService {
  private configs: CorrectionConfig[] = [
    {
      id: 'COR-001',
      businessUnitName: 'Uniasselvi',
      clusterName: 'Cluster Sul',
      courseName: 'Engenharia de Software',
      disciplineName: 'Algoritmos',
      activityTypeName: 'Desafio Profissional',
      promptTitle: 'Prompt Corretor Padrão',
      correctionStatus: 'Inativo',
      createdAt: '2026-01-10 10:00',
      createdBy: 'USR-Admin',
      updatedAt: '2026-01-10 10:00',
      updatedBy: 'USR-Admin',
      activatedByUserId: 'USR-Admin',
      activatedByName: 'Admin',
      updatedByUserId: 'USR-Admin',
      activatedAt: '2026-01-10 10:00',
      deactivatedAt: '',
    },
    {
      id: 'COR-002',
      businessUnitName: 'Uniasselvi',
      clusterName: 'Cluster Sul',
      courseName: 'Engenharia de Software',
      disciplineName: 'Banco de Dados',
      activityTypeName: 'Desafio Profissional',
      promptTitle: 'Prompt Corretor Padrão',
      correctionStatus: 'Inativo',
      createdAt: '2026-01-10 10:00',
      createdBy: 'USR-Admin',
      updatedAt: '2026-01-10 10:00',
      updatedBy: 'USR-Admin',
      activatedByUserId: 'USR-Admin',
      activatedByName: 'Admin',
      updatedByUserId: 'USR-Admin',
      activatedAt: '2026-01-10 10:00',
      deactivatedAt: '',
    },
    {
      id: 'COR-003',
      businessUnitName: 'Uniasselvi',
      clusterName: 'Cluster Sul',
      courseName: 'Administração',
      disciplineName: 'Gestão de Projetos',
      activityTypeName: 'Resenha',
      promptTitle: 'Prompt Resenha Crítica',
      correctionStatus: 'Inativo',
      createdAt: '2026-01-10 10:00',
      createdBy: 'USR-Admin',
      updatedAt: '2026-01-10 10:00',
      updatedBy: 'USR-Admin',
      activatedByUserId: 'USR-Admin',
      activatedByName: 'Admin',
      updatedByUserId: 'USR-Admin',
      activatedAt: '2026-01-10 10:00',
      deactivatedAt: '',
    },
  ];

  getConfigs(): Observable<CorrectionConfig[]> {
    return of([...this.configs]).pipe(delay(300));
  }

  exportConfigs(): Observable<CorrectionConfig[]> {
    return of([...this.configs]).pipe(delay(300));
  }

  updateStatus(id: string, status: 'Ativo' | 'Inativo'): Observable<CorrectionConfig> {
    const index = this.configs.findIndex((c) => c.id === id);
    if (index >= 0) {
      const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
      this.configs[index] = {
        ...this.configs[index],
        correctionStatus: status,
        updatedAt: now,
        updatedBy: 'USR-Current',
        updatedByUserId: 'USR-Current',
        activatedByUserId:
          status === 'Ativo' ? 'USR-Current' : this.configs[index].activatedByUserId,
        activatedByName: status === 'Ativo' ? 'Usuário Atual' : this.configs[index].activatedByName,
        activatedAt: status === 'Ativo' ? now : this.configs[index].activatedAt,
        deactivatedAt: status === 'Inativo' ? now : this.configs[index].deactivatedAt,
      };
    }
    return of(this.configs[index]).pipe(delay(300));
  }

  updateStatuses(ids: string[], status: 'Ativo' | 'Inativo'): Observable<boolean> {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    ids.forEach((id) => {
      const index = this.configs.findIndex((c) => c.id === id);
      if (index >= 0) {
        this.configs[index] = {
          ...this.configs[index],
          correctionStatus: status,
          updatedAt: now,
          updatedBy: 'USR-Current',
          updatedByUserId: 'USR-Current',
          activatedByUserId:
            status === 'Ativo' ? 'USR-Current' : this.configs[index].activatedByUserId,
          activatedByName:
            status === 'Ativo' ? 'Usuário Atual' : this.configs[index].activatedByName,
          activatedAt: status === 'Ativo' ? now : this.configs[index].activatedAt,
          deactivatedAt: status === 'Inativo' ? now : this.configs[index].deactivatedAt,
        };
      }
    });
    return of(true).pipe(delay(500));
  }

  getConfigStatus(id: string): 'Ativo' | 'Inativo' | undefined {
    return this.configs.find((c) => c.id === id)?.correctionStatus;
  }
}
