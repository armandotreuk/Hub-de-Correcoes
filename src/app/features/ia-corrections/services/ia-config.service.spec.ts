import { vi, describe, it, beforeEach, expect, afterEach } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { IaConfigMockService } from './ia-config.service';

describe('IaConfigMockService', () => {
  let service: IaConfigMockService;

  beforeEach(() => {
    service = new IaConfigMockService();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getBusinessUnits', () => {
    it('deve retornar unidades de negócio', async () => {
      const result = await firstValueFrom(service.getBusinessUnits());
      expect(result.length).toBe(2);
      expect(result[0].name).toBe('Uniasselvi');
    });
  });

  describe('getActivities', () => {
    it('deve retornar tipos de atividade', async () => {
      const result = await firstValueFrom(service.getActivities(1));
      expect(result.length).toBe(4);
    });
  });

  describe('getClusters', () => {
    it('deve retornar clusters', async () => {
      const result = await firstValueFrom(service.getClusters(1));
      expect(result.length).toBe(4);
    });
  });

  describe('getCoursesByClusters', () => {
    it('deve retornar cursos por clusters', async () => {
      const result = await firstValueFrom(service.getCoursesByClusters([1, 2]));
      expect(result.length).toBe(6);
    });

    it('deve retornar array vazio para clusters vazios', async () => {
      const result = await firstValueFrom(service.getCoursesByClusters([]));
      expect(result.length).toBe(0);
    });
  });

  describe('getSubjects', () => {
    it('deve retornar subjects', async () => {
      const result = await firstValueFrom(service.getSubjects(1, 1));
      expect(result.length).toBe(25);
    });
  });

  describe('getDisciplinesByCourses', () => {
    it('deve retornar disciplinas por cursos', async () => {
      const result = await firstValueFrom(service.getDisciplinesByCourses([1, 2]));
      expect(result.length).toBe(6);
    });

    it('deve retornar array vazio para cursos vazios', async () => {
      const result = await firstValueFrom(service.getDisciplinesByCourses([]));
      expect(result.length).toBe(0);
    });
  });

  describe('getAuditLogs', () => {
    it('deve retornar logs de auditoria', async () => {
      const result = await firstValueFrom(service.getAuditLogs());
      expect(result.length).toBe(2);
    });
  });

  describe('saveConfig', () => {
    it('deve salvar nova configuração', async () => {
      const result = await firstValueFrom(service.saveConfig({ unitId: '1' }));
      expect(result.success).toBe(true);
      expect(result.id).toMatch(/^CFG-\d{3}$/);
    });
  });

  describe('disableConfig', () => {
    it('deve desativar configuração existente', async () => {
      const result = await firstValueFrom(service.disableConfig('CFG-001'));
      expect(result).toBe(true);
    });

    it('deve retornar false para configuração inexistente', async () => {
      const result = await firstValueFrom(service.disableConfig('CFG-999'));
      expect(result).toBe(false);
    });
  });

  describe('updateStatuses', () => {
    it('deve atualizar status em massa', async () => {
      const result = await firstValueFrom(
        service.updateStatuses(['CFG-001', 'CFG-002'], 'Inativo'),
      );
      expect(result).toBe(true);
    });
  });
});
