import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Prompt, BusinessUnit, ActivityType } from '../models/ia-corrections.models';

@Injectable({ providedIn: 'root' })
export class PromptService {

  private prompts: Prompt[] = [
    {
      id: 'PRM-001',
      title: 'Prompt Corretor Padrão',
      body: 'Você é um corretor acadêmico especializado. Avalie a resposta do aluno considerando: 1) Adequação ao tema proposto; 2) Fundamentação teórica; 3) Coerência argumentativa; 4) Uso correto da norma culta da língua portuguesa. Atribua uma nota de 0 a 100 e forneça feedback construtivo detalhado ao aluno, indicando pontos fortes e sugestões de melhoria.',
      businessUnitId: 1,
      businessUnitName: 'Uniasselvi',
      activityTypeId: 1,
      activityTypeName: 'Desafio Profissional',
      createdAt: '2026-01-10',
      createdBy: 'USR-AdminPedagogico'
    },
    {
      id: 'PRM-002',
      title: 'Prompt Resenha Crítica',
      body: 'Você é um avaliador acadêmico especializado em resenhas críticas. Analise o texto submetido verificando: 1) Identificação clara da obra resenhada; 2) Resumo objetivo do conteúdo; 3) Análise crítica fundamentada com argumentos do aluno; 4) Posicionamento pessoal coerente; 5) Qualidade da redação e norma culta. Forneça nota de 0 a 100 e comentários específicos por critério.',
      businessUnitId: 1,
      businessUnitName: 'Uniasselvi',
      activityTypeId: 2,
      activityTypeName: 'Resenha',
      createdAt: '2026-01-15',
      createdBy: 'USR-CoordPedagogico'
    },
    {
      id: 'PRM-003',
      title: 'Prompt MAPA Avaliativo',
      body: 'Você é um avaliador de Material de Avaliação Prática da Aprendizagem (MAPA). Analise a submissão do aluno considerando: 1) Aplicação prática dos conceitos teóricos estudados; 2) Resolução correta dos problemas propostos; 3) Clareza na apresentação da solução; 4) Criatividade e originalidade na abordagem. Atribua nota de 0 a 100 com justificativa detalhada.',
      businessUnitId: 2,
      businessUnitName: 'Unicesumar',
      activityTypeId: 3,
      activityTypeName: 'MAPA',
      createdAt: '2026-02-01',
      createdBy: 'USR-AdminPedagogico'
    },
    {
      id: 'PRM-004',
      title: 'Prompt Prova Dissertativa',
      body: 'Você é um corretor de provas dissertativas. Avalie cada questão respondida pelo aluno verificando: 1) Compreensão do enunciado; 2) Precisão conceitual nas respostas; 3) Profundidade da argumentação; 4) Exemplificação quando pertinente; 5) Organização textual. Atribua nota parcial por questão e nota total de 0 a 100. Indique acertos e erros específicos.',
      businessUnitId: 2,
      businessUnitName: 'Unicesumar',
      activityTypeId: 4,
      activityTypeName: 'Prova',
      createdAt: '2026-02-20',
      createdBy: 'USR-CoordPedagogico'
    }
  ];

  private businessUnits: BusinessUnit[] = [
    { id: 1, name: 'Uniasselvi' },
    { id: 2, name: 'Unicesumar' }
  ];

  private activityTypes: ActivityType[] = [
    { id: 1, name: 'Desafio Profissional' },
    { id: 2, name: 'Resenha' },
    { id: 3, name: 'MAPA' },
    { id: 4, name: 'Prova' }
  ];

  getPrompts(): Observable<Prompt[]> {
    return of([...this.prompts]).pipe(delay(300));
  }

  getPromptById(id: string): Observable<Prompt | undefined> {
    return of(this.prompts.find(p => p.id === id)).pipe(delay(200));
  }

  createPrompt(payload: Omit<Prompt, 'id' | 'createdAt' | 'createdBy'>): Observable<Prompt> {
    const newPrompt: Prompt = {
      ...payload,
      id: `PRM-${String(this.prompts.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: 'USR-Current'
    };
    this.prompts.push(newPrompt);
    return of(newPrompt).pipe(delay(400));
  }

  updatePrompt(id: string, payload: Partial<Prompt>): Observable<Prompt> {
    const index = this.prompts.findIndex(p => p.id === id);
    if (index >= 0) {
      this.prompts[index] = { ...this.prompts[index], ...payload };
    }
    return of(this.prompts[index]).pipe(delay(400));
  }

  getBusinessUnits(): Observable<BusinessUnit[]> {
    return of([...this.businessUnits]).pipe(delay(200));
  }

  getActivityTypes(): Observable<ActivityType[]> {
    return of([...this.activityTypes]).pipe(delay(200));
  }
}
