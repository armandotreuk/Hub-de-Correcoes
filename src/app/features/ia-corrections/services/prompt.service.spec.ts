import { vi, describe, it, beforeEach, expect, afterEach } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { PromptService } from './prompt.service';
import { Prompt } from '../models/ia-corrections.models';

describe('PromptService', () => {
  let service: PromptService;

  beforeEach(() => {
    service = new PromptService();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getPrompts', () => {
    it('deve retornar lista de prompts', async () => {
      const result = await firstValueFrom(service.getPrompts());
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(4);
    });

    it('deve retornar prompts com IDs corretos', async () => {
      const result = await firstValueFrom(service.getPrompts());
      expect(result[0].id).toBe('PRM-001');
      expect(result[3].id).toBe('PRM-004');
    });
  });

  describe('getPromptById', () => {
    it('deve retornar prompt existente', async () => {
      const result = await firstValueFrom(service.getPromptById('PRM-001'));
      expect(result).toBeDefined();
      expect(result?.title).toBe('Prompt Corretor Padrão');
    });

    it('deve retornar undefined para ID inexistente', async () => {
      const result = await firstValueFrom(service.getPromptById('PRM-999'));
      expect(result).toBeUndefined();
    });
  });

  describe('createPrompt', () => {
    it('deve criar prompt válido com todos os campos', async () => {
      const payload = {
        title: 'Novo Prompt',
        bodyEvaluation: 'Avaliação teste',
        bodyFeedback: 'Feedback teste',
        businessUnitId: 1,
        businessUnitName: 'Uniasselvi',
        activityTypeId: 1,
        activityTypeName: 'Desafio Profissional',
        status: 'Ativo' as const,
        observations: 'Observações iniciais',
      };

      const result = await firstValueFrom(service.createPrompt(payload));
      expect(result).toBeDefined();
      expect(result.title).toBe('Novo Prompt');
      expect(result.id).toMatch(/^PRM-\d{3}$/);
      expect(result.createdAt).toBeDefined();
      expect(result.createdBy).toBe('USR-Current');
      expect(result.observations).toBe('Observações iniciais');
    });

    it('deve definir status padrão como Ativo quando não informado', async () => {
      const payload = {
        title: 'Prompt Sem Status',
        bodyEvaluation: 'Avaliação',
        bodyFeedback: 'Feedback',
        businessUnitId: 1,
        businessUnitName: 'Uniasselvi',
        activityTypeId: 1,
        activityTypeName: 'Desafio Profissional',
      };

      const result = await firstValueFrom(service.createPrompt(payload as any));
      expect(result.status).toBe('Ativo');
    });

    it('deve definir observações vazias quando não informadas', async () => {
      const payload = {
        title: 'Prompt Sem Obs',
        bodyEvaluation: 'Avaliação',
        bodyFeedback: 'Feedback',
        businessUnitId: 1,
        businessUnitName: 'Uniasselvi',
        activityTypeId: 1,
        activityTypeName: 'Desafio Profissional',
      };

      const result = await firstValueFrom(service.createPrompt(payload as any));
      expect(result.observations).toBe('');
    });
  });

  describe('updatePrompt', () => {
    it('deve atualizar prompt existente', async () => {
      const result = await firstValueFrom(
        service.updatePrompt('PRM-001', { title: 'Título Atualizado' }),
      );
      expect(result.title).toBe('Título Atualizado');
    });

    it('deve retornar undefined para prompt inexistente', async () => {
      const result = await firstValueFrom(service.updatePrompt('PRM-999', { title: 'Não Existe' }));
      expect(result).toBeUndefined();
    });
  });

  describe('updatePromptStatus', () => {
    it('deve atualizar status para Inativo', async () => {
      const result = await firstValueFrom(service.updatePromptStatus('PRM-001', 'Inativo'));
      expect(result.status).toBe('Inativo');
    });

    it('deve atualizar status para Ativo', async () => {
      await firstValueFrom(service.updatePromptStatus('PRM-001', 'Inativo'));
      const result = await firstValueFrom(service.updatePromptStatus('PRM-001', 'Ativo'));
      expect(result.status).toBe('Ativo');
    });

    it('deve retornar undefined para ID inexistente', async () => {
      const result = await firstValueFrom(service.updatePromptStatus('PRM-999', 'Inativo'));
      expect(result).toBeUndefined();
    });
  });

  describe('updatePromptObservations', () => {
    it('deve atualizar observações', async () => {
      const result = await firstValueFrom(
        service.updatePromptObservations('PRM-001', 'Novas observações'),
      );
      expect(result.observations).toBe('Novas observações');
    });

    it('deve retornar undefined para ID inexistente', async () => {
      const result = await firstValueFrom(
        service.updatePromptObservations('PRM-999', 'Observações'),
      );
      expect(result).toBeUndefined();
    });
  });

  describe('getBusinessUnits', () => {
    it('deve retornar lista de unidades de negócio', async () => {
      const result = await firstValueFrom(service.getBusinessUnits());
      expect(result.length).toBe(2);
      expect(result[0].name).toBe('Uniasselvi');
      expect(result[1].name).toBe('Unicesumar');
    });
  });

  describe('getActivityTypes', () => {
    it('deve retornar lista de tipos de atividade', async () => {
      const result = await firstValueFrom(service.getActivityTypes());
      expect(result.length).toBe(4);
      expect(result.map((a) => a.name)).toContain('Desafio Profissional');
      expect(result.map((a) => a.name)).toContain('Resenha');
      expect(result.map((a) => a.name)).toContain('MAPA');
      expect(result.map((a) => a.name)).toContain('Prova');
    });
  });
});
