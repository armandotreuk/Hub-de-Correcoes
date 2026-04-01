import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { CorrectionConfig } from '../models/ia-corrections.models';

@Injectable({ providedIn: 'root' })
export class CorrectionConfigService {
  private configs: CorrectionConfig[] = [
    // Engenharia de Software (101) - Cluster Sul - Uniasselvi
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
    },
    {
      id: 'COR-003',
      businessUnitName: 'Uniasselvi',
      clusterName: 'Cluster Sul',
      courseName: 'Engenharia de Software',
      disciplineName: 'Engenharia de Requisitos',
      activityTypeName: 'Desafio Profissional',
      promptTitle: 'Prompt Corretor Padrão',
      correctionStatus: 'Inativo',
      createdAt: '2026-01-10 10:00',
      createdBy: 'USR-Admin',
      updatedAt: '2026-01-10 10:00',
      updatedBy: 'USR-Admin',
    },
    {
      id: 'COR-004',
      businessUnitName: 'Uniasselvi',
      clusterName: 'Cluster Sul',
      courseName: 'Engenharia de Software',
      disciplineName: 'Arquitetura de Software',
      activityTypeName: 'Desafio Profissional',
      promptTitle: 'Prompt Corretor Padrão',
      correctionStatus: 'Inativo',
      createdAt: '2026-01-10 10:00',
      createdBy: 'USR-Admin',
      updatedAt: '2026-01-10 10:00',
      updatedBy: 'USR-Admin',
    },
    {
      id: 'COR-005',
      businessUnitName: 'Uniasselvi',
      clusterName: 'Cluster Sul',
      courseName: 'Engenharia de Software',
      disciplineName: 'Testes de Software',
      activityTypeName: 'Desafio Profissional',
      promptTitle: 'Prompt Corretor Padrão',
      correctionStatus: 'Inativo',
      createdAt: '2026-01-10 10:00',
      createdBy: 'USR-Admin',
      updatedAt: '2026-01-10 10:00',
      updatedBy: 'USR-Admin',
    },
    // Administração (102) - Cluster Sul - Uniasselvi
    {
      id: 'COR-006',
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
    },
    {
      id: 'COR-007',
      businessUnitName: 'Uniasselvi',
      clusterName: 'Cluster Sul',
      courseName: 'Administração',
      disciplineName: 'Marketing',
      activityTypeName: 'Resenha',
      promptTitle: 'Prompt Resenha Crítica',
      correctionStatus: 'Inativo',
      createdAt: '2026-01-10 10:00',
      createdBy: 'USR-Admin',
      updatedAt: '2026-01-10 10:00',
      updatedBy: 'USR-Admin',
    },
    {
      id: 'COR-008',
      businessUnitName: 'Uniasselvi',
      clusterName: 'Cluster Sul',
      courseName: 'Administração',
      disciplineName: 'Contabilidade Gerencial',
      activityTypeName: 'Resenha',
      promptTitle: 'Prompt Resenha Crítica',
      correctionStatus: 'Inativo',
      createdAt: '2026-01-10 10:00',
      createdBy: 'USR-Admin',
      updatedAt: '2026-01-10 10:00',
      updatedBy: 'USR-Admin',
    },
    {
      id: 'COR-009',
      businessUnitName: 'Uniasselvi',
      clusterName: 'Cluster Sul',
      courseName: 'Administração',
      disciplineName: 'Recursos Humanos',
      activityTypeName: 'Resenha',
      promptTitle: 'Prompt Resenha Crítica',
      correctionStatus: 'Inativo',
      createdAt: '2026-01-10 10:00',
      createdBy: 'USR-Admin',
      updatedAt: '2026-01-10 10:00',
      updatedBy: 'USR-Admin',
    },
    {
      id: 'COR-010',
      businessUnitName: 'Uniasselvi',
      clusterName: 'Cluster Sul',
      courseName: 'Administração',
      disciplineName: 'Logística',
      activityTypeName: 'Resenha',
      promptTitle: 'Prompt Resenha Crítica',
      correctionStatus: 'Inativo',
      createdAt: '2026-01-10 10:00',
      createdBy: 'USR-Admin',
      updatedAt: '2026-01-10 10:00',
      updatedBy: 'USR-Admin',
    },
    // Ciência da Computação (201) - Cluster Norte - Uniasselvi
    {
      id: 'COR-011',
      businessUnitName: 'Uniasselvi',
      clusterName: 'Cluster Norte',
      courseName: 'Ciência da Computação',
      disciplineName: 'Estrutura de Dados',
      activityTypeName: 'Desafio Profissional',
      promptTitle: 'Prompt Corretor Padrão',
      correctionStatus: 'Inativo',
      createdAt: '2026-01-10 10:00',
      createdBy: 'USR-Admin',
      updatedAt: '2026-01-10 10:00',
      updatedBy: 'USR-Admin',
    },
    {
      id: 'COR-012',
      businessUnitName: 'Uniasselvi',
      clusterName: 'Cluster Norte',
      courseName: 'Ciência da Computação',
      disciplineName: 'Redes de Computadores',
      activityTypeName: 'Desafio Profissional',
      promptTitle: 'Prompt Corretor Padrão',
      correctionStatus: 'Inativo',
      createdAt: '2026-01-10 10:00',
      createdBy: 'USR-Admin',
      updatedAt: '2026-01-10 10:00',
      updatedBy: 'USR-Admin',
    },
    {
      id: 'COR-013',
      businessUnitName: 'Uniasselvi',
      clusterName: 'Cluster Norte',
      courseName: 'Ciência da Computação',
      disciplineName: 'Sistemas Operacionais',
      activityTypeName: 'Desafio Profissional',
      promptTitle: 'Prompt Corretor Padrão',
      correctionStatus: 'Inativo',
      createdAt: '2026-01-10 10:00',
      createdBy: 'USR-Admin',
      updatedAt: '2026-01-10 10:00',
      updatedBy: 'USR-Admin',
    },
    // Engenharia Civil (301) - Cluster Centro - Unicesumar
    {
      id: 'COR-014',
      businessUnitName: 'Unicesumar',
      clusterName: 'Cluster Centro',
      courseName: 'Engenharia Civil',
      disciplineName: 'Materiais de Construção',
      activityTypeName: 'MAPA',
      promptTitle: 'Prompt MAPA Avaliativo',
      correctionStatus: 'Inativo',
      createdAt: '2026-01-10 10:00',
      createdBy: 'USR-Admin',
      updatedAt: '2026-01-10 10:00',
      updatedBy: 'USR-Admin',
    },
    {
      id: 'COR-015',
      businessUnitName: 'Unicesumar',
      clusterName: 'Cluster Centro',
      courseName: 'Engenharia Civil',
      disciplineName: 'Mecânica dos Solos',
      activityTypeName: 'MAPA',
      promptTitle: 'Prompt MAPA Avaliativo',
      correctionStatus: 'Inativo',
      createdAt: '2026-01-10 10:00',
      createdBy: 'USR-Admin',
      updatedAt: '2026-01-10 10:00',
      updatedBy: 'USR-Admin',
    },
    // Design Gráfico (402) - Cluster Oeste - Unicesumar
    {
      id: 'COR-016',
      businessUnitName: 'Unicesumar',
      clusterName: 'Cluster Oeste',
      courseName: 'Design Gráfico',
      disciplineName: 'Design de Identidade',
      activityTypeName: 'Prova',
      promptTitle: 'Prompt Prova Dissertativa',
      correctionStatus: 'Inativo',
      createdAt: '2026-01-10 10:00',
      createdBy: 'USR-Admin',
      updatedAt: '2026-01-10 10:00',
      updatedBy: 'USR-Admin',
    },
    {
      id: 'COR-017',
      businessUnitName: 'Unicesumar',
      clusterName: 'Cluster Oeste',
      courseName: 'Design Gráfico',
      disciplineName: 'Tipografia',
      activityTypeName: 'Prova',
      promptTitle: 'Prompt Prova Dissertativa',
      correctionStatus: 'Inativo',
      createdAt: '2026-01-10 10:00',
      createdBy: 'USR-Admin',
      updatedAt: '2026-01-10 10:00',
      updatedBy: 'USR-Admin',
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
        };
      }
    });
    return of(true).pipe(delay(500));
  }

  getConfigStatus(id: string): 'Ativo' | 'Inativo' | undefined {
    return this.configs.find((c) => c.id === id)?.correctionStatus;
  }
}
