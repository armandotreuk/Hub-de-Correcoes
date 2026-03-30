import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { CorrectionConfig } from '../models/ia-corrections.models';
import { PromptLinkingService } from './prompt-linking.service';

@Injectable({ providedIn: 'root' })
export class CorrectionConfigService {

  private configs: CorrectionConfig[] = [
    {
      id: 'COR-001',
      businessUnitName: 'Uniasselvi',
      clusterName: 'Cluster Sul',
      courseName: 'Engenharia de Software',
      activityTypeName: 'Desafio Profissional',
      promptTitle: 'Prompt Corretor Padrão',
      correctionStatus: 'Inativo'
    },
    {
      id: 'COR-002',
      businessUnitName: 'Uniasselvi',
      clusterName: 'Cluster Norte',
      courseName: 'Ciência da Computação',
      activityTypeName: 'Desafio Profissional',
      promptTitle: 'Prompt Corretor Padrão',
      correctionStatus: 'Inativo'
    },
    {
      id: 'COR-003',
      businessUnitName: 'Uniasselvi',
      clusterName: 'Cluster Sul',
      courseName: 'Administração',
      activityTypeName: 'Resenha',
      promptTitle: 'Prompt Resenha Crítica',
      correctionStatus: 'Inativo'
    },
    {
      id: 'COR-004',
      businessUnitName: 'Unicesumar',
      clusterName: 'Cluster Centro',
      courseName: 'Engenharia Civil',
      activityTypeName: 'MAPA',
      promptTitle: 'Prompt MAPA Avaliativo',
      correctionStatus: 'Inativo'
    },
    {
      id: 'COR-005',
      businessUnitName: 'Unicesumar',
      clusterName: 'Cluster Oeste',
      courseName: 'Design Gráfico',
      activityTypeName: 'Prova',
      promptTitle: 'Prompt Prova Dissertativa',
      correctionStatus: 'Inativo'
    },
    {
      id: 'COR-006',
      businessUnitName: 'Uniasselvi',
      clusterName: 'Cluster Sul',
      courseName: 'Pedagogia',
      activityTypeName: 'Desafio Profissional',
      promptTitle: 'Prompt Corretor Padrão',
      correctionStatus: 'Inativo'
    },
    {
      id: 'COR-007',
      businessUnitName: 'Unicesumar',
      clusterName: 'Cluster Centro',
      courseName: 'Psicologia',
      activityTypeName: 'Prova',
      promptTitle: 'Prompt Prova Dissertativa',
      correctionStatus: 'Inativo'
    }
  ];

  getConfigs(): Observable<CorrectionConfig[]> {
    return of([...this.configs]).pipe(delay(300));
  }

  updateStatus(id: string, status: 'Ativo' | 'Inativo'): Observable<CorrectionConfig> {
    const index = this.configs.findIndex(c => c.id === id);
    if (index >= 0) {
      this.configs[index] = { ...this.configs[index], correctionStatus: status };
    }
    return of(this.configs[index]).pipe(delay(300));
  }

  updateStatuses(ids: string[], status: 'Ativo' | 'Inativo'): Observable<boolean> {
    ids.forEach(id => {
      const index = this.configs.findIndex(c => c.id === id);
      if (index >= 0) {
        this.configs[index] = { ...this.configs[index], correctionStatus: status };
      }
    });
    return of(true).pipe(delay(500));
  }

  /** Usado pela Aba 5 (Publicação) para verificar dependência */
  getConfigStatus(id: string): 'Ativo' | 'Inativo' | undefined {
    return this.configs.find(c => c.id === id)?.correctionStatus;
  }
}
