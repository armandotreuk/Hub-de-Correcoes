import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { PublicationConfig, PublicationGlobalSettings } from '../models/ia-corrections.models';
import { CorrectionConfigService } from './correction-config.service';

@Injectable({ providedIn: 'root' })
export class PublicationService {
  private correctionConfigService = inject(CorrectionConfigService);

  private configs: PublicationConfig[] = [
    // Alinhado com IDs do CorrectionConfigService (roughly)
    {
      id: 'PUB-001',
      businessUnitName: 'Uniasselvi',
      clusterName: 'Cluster Sul',
      courseName: 'Engenharia de Software',
      disciplineName: 'Algoritmos',
      activityTypeName: 'Desafio Profissional',
      promptTitle: 'Prompt Corretor Padrão',
      correctionStatus: 'Inativo',
      publicationStatus: 'Inativa',
      performanceThreshold: null,
      activatedBy: '-',
      activatedAt: '-',
      activatedByUserId: '',
      activatedByName: '',
      updatedByUserId: '',
      deactivatedAt: '',
    },
    {
      id: 'PUB-002',
      businessUnitName: 'Uniasselvi',
      clusterName: 'Cluster Norte',
      courseName: 'Ciência da Computação',
      disciplineName: 'Estrutura de Dados',
      activityTypeName: 'Desafio Profissional',
      promptTitle: 'Prompt Corretor Padrão',
      correctionStatus: 'Inativo',
      publicationStatus: 'Inativa',
      performanceThreshold: null,
      activatedBy: '-',
      activatedAt: '-',
      activatedByUserId: '',
      activatedByName: '',
      updatedByUserId: '',
      deactivatedAt: '',
    },
    {
      id: 'PUB-003',
      businessUnitName: 'Uniasselvi',
      clusterName: 'Cluster Sul',
      courseName: 'Administração',
      disciplineName: 'Gestão de Projetos',
      activityTypeName: 'Resenha',
      promptTitle: 'Prompt Resenha Crítica',
      correctionStatus: 'Inativo',
      publicationStatus: 'Inativa',
      performanceThreshold: null,
      activatedBy: '-',
      activatedAt: '-',
      activatedByUserId: '',
      activatedByName: '',
      updatedByUserId: '',
      deactivatedAt: '',
    },
    {
      id: 'PUB-004',
      businessUnitName: 'Unicesumar',
      clusterName: 'Cluster Centro',
      courseName: 'Engenharia Civil',
      disciplineName: 'Materiais de Construção',
      activityTypeName: 'MAPA',
      promptTitle: 'Prompt MAPA Avaliativo',
      correctionStatus: 'Inativo',
      publicationStatus: 'Inativa',
      performanceThreshold: null,
      activatedBy: '-',
      activatedAt: '-',
      activatedByUserId: '',
      activatedByName: '',
      updatedByUserId: '',
      deactivatedAt: '',
    },
    {
      id: 'PUB-005',
      businessUnitName: 'Unicesumar',
      clusterName: 'Cluster Oeste',
      courseName: 'Design Gráfico',
      disciplineName: 'Design de Identidade',
      activityTypeName: 'Prova',
      promptTitle: 'Prompt Prova Dissertativa',
      correctionStatus: 'Inativo',
      publicationStatus: 'Inativa',
      performanceThreshold: null,
      activatedBy: '-',
      activatedAt: '-',
      activatedByUserId: '',
      activatedByName: '',
      updatedByUserId: '',
      deactivatedAt: '',
    },
    {
      id: 'PUB-006',
      businessUnitName: 'Uniasselvi',
      clusterName: 'Cluster Sul',
      courseName: 'Pedagogia',
      disciplineName: 'Didática',
      activityTypeName: 'Desafio Profissional',
      promptTitle: 'Prompt Corretor Padrão',
      correctionStatus: 'Inativo',
      publicationStatus: 'Inativa',
      performanceThreshold: null,
      activatedBy: '-',
      activatedAt: '-',
      activatedByUserId: '',
      activatedByName: '',
      updatedByUserId: '',
      deactivatedAt: '',
    },
    {
      id: 'PUB-007',
      businessUnitName: 'Unicesumar',
      clusterName: 'Cluster Centro',
      courseName: 'Psicologia',
      disciplineName: 'Psicologia Geral',
      activityTypeName: 'Prova',
      promptTitle: 'Prompt Prova Dissertativa',
      correctionStatus: 'Inativo',
      publicationStatus: 'Inativa',
      performanceThreshold: null,
      activatedBy: '-',
      activatedAt: '-',
      activatedByUserId: '',
      activatedByName: '',
      updatedByUserId: '',
      deactivatedAt: '',
    },
  ];

  getPublicationConfigs(): Observable<PublicationConfig[]> {
    // Sincronizar correctionStatus com o serviço de correção
    this.configs.forEach((config) => {
      const corrId = config.id.replace('PUB-', 'COR-');
      const corrStatus = this.correctionConfigService.getConfigStatus(corrId);
      if (corrStatus) {
        config.correctionStatus = corrStatus;
        // F.6: Não há bloqueio retroativo. A publicação continua ativa mesmo se a correção for inativada posteriormente.
      }
    });
    return of([...this.configs]).pipe(delay(300));
  }

  updatePublicationStatus(id: string, status: 'Ativa' | 'Inativa'): Observable<PublicationConfig> {
    const index = this.configs.findIndex((c) => c.id === id);
    if (index < 0) {
      return throwError(() => new Error('Registro não encontrado.'));
    }

    if (status === 'Ativa') {
      const corrId = id.replace('PUB-', 'COR-');
      const corrStatus = this.correctionConfigService.getConfigStatus(corrId);
      if (corrStatus === 'Inativo') {
        return throwError(
          () =>
            new Error(
              'Não é possível habilitar a publicação automática enquanto a correção está desabilitada.',
            ),
        );
      }
    }

    this.configs[index] = {
      ...this.configs[index],
      publicationStatus: status,
      activatedBy: status === 'Ativa' ? 'USR-Current' : this.configs[index].activatedBy,
      activatedAt:
        status === 'Ativa'
          ? new Date().toISOString().split('T')[0]
          : this.configs[index].activatedAt,
      performanceThreshold: status === 'Inativa' ? null : this.configs[index].performanceThreshold,
      activatedByUserId: status === 'Ativa' ? 'USR-Current' : this.configs[index].activatedByUserId,
      activatedByName: status === 'Ativa' ? 'Usuário Atual' : this.configs[index].activatedByName,
      updatedByUserId: 'USR-Current',
      deactivatedAt:
        status === 'Inativa'
          ? new Date().toISOString().split('T')[0]
          : this.configs[index].deactivatedAt,
    };
    return of(this.configs[index]).pipe(delay(300));
  }

  updatePublicationStatuses(ids: string[], status: 'Ativa' | 'Inativa'): Observable<boolean> {
    let blocked = 0;
    ids.forEach((id) => {
      const index = this.configs.findIndex((c) => c.id === id);
      if (index >= 0) {
        if (status === 'Ativa') {
          const corrId = id.replace('PUB-', 'COR-');
          const corrStatus = this.correctionConfigService.getConfigStatus(corrId);
          if (corrStatus === 'Inativo') {
            blocked++;
            return;
          }
        }
        this.configs[index] = {
          ...this.configs[index],
          publicationStatus: status,
          activatedBy: status === 'Ativa' ? 'USR-Current' : this.configs[index].activatedBy,
          activatedAt:
            status === 'Ativa'
              ? new Date().toISOString().split('T')[0]
              : this.configs[index].activatedAt,
          performanceThreshold:
            status === 'Inativa' ? null : this.configs[index].performanceThreshold,
          activatedByUserId:
            status === 'Ativa' ? 'USR-Current' : this.configs[index].activatedByUserId,
          activatedByName:
            status === 'Ativa' ? 'Usuário Atual' : this.configs[index].activatedByName,
          updatedByUserId: 'USR-Current',
          deactivatedAt:
            status === 'Inativa'
              ? new Date().toISOString().split('T')[0]
              : this.configs[index].deactivatedAt,
        };
      }
    });
    return of(true).pipe(delay(500));
  }

  setPerformanceThreshold(id: string, percentage: number): Observable<PublicationConfig> {
    const index = this.configs.findIndex((c) => c.id === id);
    if (index >= 0) {
      this.configs[index] = { ...this.configs[index], performanceThreshold: percentage };
    }
    return of(this.configs[index]).pipe(delay(300));
  }

  private globalSettings: PublicationGlobalSettings = {
    note: null,
    deadline: null,
    autoPublicationEnabled: false,
  };

  getGlobalSettings(): Observable<PublicationGlobalSettings> {
    return of({ ...this.globalSettings }).pipe(delay(200));
  }

  saveGlobalSettings(
    note: number | null,
    deadline: number | null,
    enabled: boolean,
  ): Observable<PublicationGlobalSettings> {
    this.globalSettings = {
      note,
      deadline,
      autoPublicationEnabled: enabled,
    };
    return of({ ...this.globalSettings }).pipe(delay(300));
  }
}
