import { vi, describe, it, beforeEach, expect, afterEach } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { PromptLinkingService } from './prompt-linking.service';

describe('PromptLinkingService', () => {
  let service: PromptLinkingService;

  beforeEach(() => {
    service = new PromptLinkingService();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getAllCourses', () => {
    it('deve retornar todos os cursos', async () => {
      const result = await firstValueFrom(service.getAllCourses());
      expect(result.length).toBe(13);
    });
  });

  describe('getCoursesByUnit', () => {
    it('deve filtrar cursos por unidade', async () => {
      const result = await firstValueFrom(service.getCoursesByUnit(1));
      expect(result.every((c) => c.businessUnitId === 1)).toBe(true);
    });

    it('deve retornar array vazio para unidade inexistente', async () => {
      const result = await firstValueFrom(service.getCoursesByUnit(999));
      expect(result.length).toBe(0);
    });
  });

  describe('getAllDisciplines', () => {
    it('deve retornar todas as disciplinas', async () => {
      const result = await firstValueFrom(service.getAllDisciplines());
      expect(result.length).toBe(65);
    });
  });

  describe('getDisciplinesByFilters', () => {
    it('deve filtrar disciplinas por unidade', async () => {
      const result = await firstValueFrom(
        service.getDisciplinesByFilters([1], undefined, undefined),
      );
      expect(result.every((d) => d.businessUnitId === 1)).toBe(true);
    });

    it('deve filtrar disciplinas por cluster', async () => {
      const result = await firstValueFrom(
        service.getDisciplinesByFilters(undefined, [1], undefined),
      );
      expect(result.every((d) => d.clusterId === 1)).toBe(true);
    });

    it('deve filtrar disciplinas por curso', async () => {
      const result = await firstValueFrom(
        service.getDisciplinesByFilters(undefined, undefined, [101]),
      );
      expect(result.every((d) => d.courseId === 101)).toBe(true);
      expect(result.length).toBe(5);
    });

    it('deve retornar todas as disciplinas sem filtros', async () => {
      const result = await firstValueFrom(service.getDisciplinesByFilters());
      expect(result.length).toBe(65);
    });
  });

  describe('getAllLinks', () => {
    it('deve retornar todos os vínculos', async () => {
      const result = await firstValueFrom(service.getAllLinks());
      expect(result.length).toBe(3);
    });
  });

  describe('getLinksByPrompt', () => {
    it('deve filtrar vínculos por prompt', async () => {
      const result = await firstValueFrom(service.getLinksByPrompt('PRM-001'));
      expect(result.length).toBe(2);
      expect(result.every((l) => l.promptId === 'PRM-001')).toBe(true);
    });

    it('deve retornar array vazio para prompt sem vínculos', async () => {
      const result = await firstValueFrom(service.getLinksByPrompt('PRM-999'));
      expect(result.length).toBe(0);
    });
  });

  describe('linkPromptToDiscipline', () => {
    it('deve vincular prompt a disciplina com sucesso', async () => {
      const result = await firstValueFrom(
        service.linkPromptToDiscipline('PRM-001', 'Prompt Teste', 1002, 'Desafio Profissional'),
      );
      expect(result).toBeDefined();
      expect(result.disciplineId).toBe(1002);
      expect(result.promptId).toBe('PRM-001');
    });

    it('deve lançar erro para vínculo duplicado', async () => {
      try {
        await firstValueFrom(
          service.linkPromptToDiscipline('PRM-001', 'Prompt Teste', 1001, 'Desafio Profissional'),
        );
        expect.fail('Deveria lançar erro');
      } catch (error: any) {
        expect(error.message).toContain('já possui o prompt');
      }
    });

    it('deve lançar erro para disciplina inexistente', async () => {
      try {
        await firstValueFrom(
          service.linkPromptToDiscipline('PRM-001', 'Prompt Teste', 9999, 'Desafio Profissional'),
        );
        expect.fail('Deveria lançar erro');
      } catch (error: any) {
        expect(error.message).toBe('Disciplina não encontrada.');
      }
    });
  });

  describe('linkPromptToDisciplines', () => {
    it('deve vincular prompt a múltiplas disciplinas', async () => {
      const result = await firstValueFrom(
        service.linkPromptToDisciplines('PRM-003', 'Prompt MAPA', [1036, 1037], 'MAPA'),
      );
      expect(result.created.length).toBe(2);
      expect(result.skipped).toBe(0);
    });

    it('deve pular vínculos duplicados', async () => {
      const result = await firstValueFrom(
        service.linkPromptToDisciplines(
          'PRM-001',
          'Prompt Teste',
          [1001, 1021],
          'Desafio Profissional',
        ),
      );
      expect(result.created.length).toBe(0);
      expect(result.skipped).toBe(2);
    });

    it('deve retornar vazio para lista vazia', async () => {
      const result = await firstValueFrom(
        service.linkPromptToDisciplines('PRM-001', 'Prompt Teste', [], 'Desafio Profissional'),
      );
      expect(result.created.length).toBe(0);
      expect(result.skipped).toBe(0);
    });
  });

  describe('unlinkPromptFromDiscipline', () => {
    it('deve desvincular prompt com sucesso', async () => {
      const result = await firstValueFrom(service.unlinkPromptFromDiscipline('LNK-001'));
      expect(result).toBe(true);
    });

    it('deve retornar true para link inexistente', async () => {
      const result = await firstValueFrom(service.unlinkPromptFromDiscipline('LNK-999'));
      expect(result).toBe(true);
    });
  });

  describe('updateDisciplinePrompt', () => {
    it('deve atualizar prompt de disciplina', async () => {
      const result = await firstValueFrom(
        service.updateDisciplinePrompt('LNK-001', 'PRM-002', 'Novo Prompt'),
      );
      expect(result.promptId).toBe('PRM-002');
      expect(result.promptTitle).toBe('Novo Prompt');
    });

    it('deve retornar undefined para link inexistente', async () => {
      const result = await firstValueFrom(
        service.updateDisciplinePrompt('LNK-999', 'PRM-002', 'Novo Prompt'),
      );
      expect(result).toBeUndefined();
    });
  });

  describe('linkPromptToCourse (compatibility)', () => {
    it('deve vincular prompt via curso', async () => {
      const result = await firstValueFrom(
        service.linkPromptToCourse('PRM-003', 'Prompt MAPA', 301, 'MAPA'),
      );
      expect(result).toBeDefined();
    });

    it('deve lançar erro para curso inexistente', async () => {
      try {
        await firstValueFrom(
          service.linkPromptToCourse('PRM-001', 'Prompt Teste', 9999, 'Desafio Profissional'),
        );
        expect.fail('Deveria lançar erro');
      } catch (error: any) {
        expect(error.message).toBe('Course not found');
      }
    });
  });

  describe('linkPromptToCourses (compatibility)', () => {
    it('deve vincular prompt a múltiplos cursos', async () => {
      const result = await firstValueFrom(
        service.linkPromptToCourses('PRM-003', 'Prompt MAPA', [101], 'MAPA'),
      );
      expect(result.length).toBe(5);
    });
  });

  describe('unlinkPromptFromCourse (compatibility)', () => {
    it('deve desvincular prompt via curso', async () => {
      const result = await firstValueFrom(service.unlinkPromptFromCourse('LNK-001'));
      expect(result).toBe(true);
    });
  });
});
