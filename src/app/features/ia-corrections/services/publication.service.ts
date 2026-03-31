import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { PublicationConfig, PublicationGlobalSettings } from '../models/ia-corrections.models';
import { CorrectionConfigService } from './correction-config.service';

@Injectable({ providedIn: 'root' })
export class PublicationService {
  private correctionConfigService = inject(CorrectionConfigService);

  private configs: PublicationConfig[] = [
    {
      id: 'PUB-001',
      businessUnitName: 'Uniasselvi',
      clusterName: 'Cluster Sul',
      courseName: 'Engenharia de Software',
      activityTypeName: 'Desafio Profissional',
      promptTitle: 'Prompt Corretor Padrão',
      correctionStatus: 'Inativo',
      publicationStatus: 'Desabilitado',
      performanceThreshold: null,
      activatedBy: '-',
      activatedAt: '-',
    },
    {
      id: 'PUB-002',
      businessUnitName: 'Uniasselvi',
      clusterName: 'Cluster Norte',
      courseName: 'Ciência da Computação',
      activityTypeName: 'Desafio Profissional',
      promptTitle: 'Prompt Corretor Padrão',
      correctionStatus: 'Inativo',
      publicationStatus: 'Desabilitado',
      performanceThreshold: null,
      activatedBy: '-',
      activatedAt: '-',
    },
    {
      id: 'PUB-003',
      businessUnitName: 'Uniasselvi',
      clusterName: 'Cluster Sul',
      courseName: 'Administração',
      activityTypeName: 'Resenha',
      promptTitle: 'Prompt Resenha Crítica',
      correctionStatus: 'Inativo',
      publicationStatus: 'Desabilitado',
      performanceThreshold: null,
      activatedBy: '-',
      activatedAt: '-',
    },
    {
      id: 'PUB-004',
      businessUnitName: 'Unicesumar',
      clusterName: 'Cluster Centro',
      courseName: 'Engenharia Civil',
      activityTypeName: 'MAPA',
      promptTitle: 'Prompt MAPA Avaliativo',
      correctionStatus: 'Inativo',
      publicationStatus: 'Desabilitado',
      performanceThreshold: null,
      activatedBy: '-',
      activatedAt: '-',
    },
    {
      id: 'PUB-005',
      businessUnitName: 'Unicesumar',
      clusterName: 'Cluster Oeste',
      courseName: 'Design Gráfico',
      activityTypeName: 'Prova',
      promptTitle: 'Prompt Prova Dissertativa',
      correctionStatus: 'Inativo',
      publicationStatus: 'Desabilitado',
      performanceThreshold: null,
      activatedBy: '-',
      activatedAt: '-',
    },
    {
      id: 'PUB-006',
      businessUnitName: 'Uniasselvi',
      clusterName: 'Cluster Sul',
      courseName: 'Pedagogia',
      activityTypeName: 'Desafio Profissional',
      promptTitle: 'Prompt Corretor Padrão',
      correctionStatus: 'Inativo',
      publicationStatus: 'Desabilitado',
      performanceThreshold: null,
      activatedBy: '-',
      activatedAt: '-',
    },
    {
      id: 'PUB-007',
      businessUnitName: 'Unicesumar',
      clusterName: 'Cluster Centro',
      courseName: 'Psicologia',
      activityTypeName: 'Prova',
      promptTitle: 'Prompt Prova Dissertativa',
      correctionStatus: 'Inativo',
      publicationStatus: 'Desabilitado',
      performanceThreshold: null,
      activatedBy: '-',
      activatedAt: '-',
    },
  ];

  getPublicationConfigs(): Observable<PublicationConfig[]> {
    // Sincronizar correctionStatus com o serviço de correção
    this.configs.forEach((config) => {
      const corrId = config.id.replace('PUB-', 'COR-');
      const corrStatus = this.correctionConfigService.getConfigStatus(corrId);
      if (corrStatus) {
        config.correctionStatus = corrStatus;
        // RN24: Se correção ficou Inativa, forçar publicação Desabilitada
        if (corrStatus === 'Inativo' && config.publicationStatus === 'Habilitado') {
          config.publicationStatus = 'Desabilitado';
          config.performanceThreshold = null;
        }
      }
    });
    return of([...this.configs]).pipe(delay(300));
  }

  updatePublicationStatus(
    id: string,
    status: 'Habilitado' | 'Desabilitado',
  ): Observable<PublicationConfig> {
    const index = this.configs.findIndex((c) => c.id === id);
    if (index < 0) {
      return throwError(() => new Error('Registro não encontrado.'));
    }

    // RN24: Validar dependência — não pode habilitar se correção está inativa
    if (status === 'Habilitado') {
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
      activatedBy: status === 'Habilitado' ? 'USR-Current' : this.configs[index].activatedBy,
      activatedAt:
        status === 'Habilitado'
          ? new Date().toISOString().split('T')[0]
          : this.configs[index].activatedAt,
      performanceThreshold:
        status === 'Desabilitado' ? null : this.configs[index].performanceThreshold,
    };
    return of(this.configs[index]).pipe(delay(300));
  }

  updatePublicationStatuses(
    ids: string[],
    status: 'Habilitado' | 'Desabilitado',
  ): Observable<boolean> {
    let blocked = 0;
    ids.forEach((id) => {
      const index = this.configs.findIndex((c) => c.id === id);
      if (index >= 0) {
        if (status === 'Habilitado') {
          const corrId = id.replace('PUB-', 'COR-');
          const corrStatus = this.correctionConfigService.getConfigStatus(corrId);
          if (corrStatus === 'Inativo') {
            blocked++;
            return; // Pula este registro (RN24)
          }
        }
        this.configs[index] = {
          ...this.configs[index],
          publicationStatus: status,
          activatedBy: status === 'Habilitado' ? 'USR-Current' : this.configs[index].activatedBy,
          activatedAt:
            status === 'Habilitado'
              ? new Date().toISOString().split('T')[0]
              : this.configs[index].activatedAt,
          performanceThreshold:
            status === 'Desabilitado' ? null : this.configs[index].performanceThreshold,
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
