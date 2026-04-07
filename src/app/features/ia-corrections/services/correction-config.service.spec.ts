import { vi, describe, it, beforeEach, expect, afterEach } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { CorrectionConfigService } from './correction-config.service';

describe('CorrectionConfigService', () => {
  let service: CorrectionConfigService;

  beforeEach(() => {
    service = new CorrectionConfigService();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getConfigs', () => {
    it('deve retornar todas as configurações', async () => {
      const result = await firstValueFrom(service.getConfigs());
      expect(result.length).toBe(3);
    });

    it('deve retornar cópia dos dados para evitar mutação externa', async () => {
      const result1 = await firstValueFrom(service.getConfigs());
      const result2 = await firstValueFrom(service.getConfigs());
      expect(result1).not.toBe(result2);
    });
  });

  describe('exportConfigs', () => {
    it('deve retornar configurações para exportação', async () => {
      const result = await firstValueFrom(service.exportConfigs());
      expect(result.length).toBe(3);
    });
  });

  describe('updateStatus', () => {
    it('deve atualizar status para Ativo', async () => {
      const result = await firstValueFrom(service.updateStatus('COR-001', 'Ativo'));
      expect(result.correctionStatus).toBe('Ativo');
    });

    it('deve atualizar status para Inativo', async () => {
      const result = await firstValueFrom(service.updateStatus('COR-001', 'Inativo'));
      expect(result.correctionStatus).toBe('Inativo');
    });

    it('deve preencher audit fields ao ativar', async () => {
      const result = await firstValueFrom(service.updateStatus('COR-001', 'Ativo'));
      expect(result.activatedByUserId).toBe('USR-Current');
      expect(result.activatedByName).toBe('Usuário Atual');
      expect(result.activatedAt).toBeDefined();
    });

    it('deve preencher deactivatedAt ao inativar', async () => {
      const result = await firstValueFrom(service.updateStatus('COR-001', 'Inativo'));
      expect(result.deactivatedAt).toBeDefined();
    });

    it('deve retornar undefined para ID inexistente', async () => {
      const result = await firstValueFrom(service.updateStatus('COR-999', 'Ativo'));
      expect(result).toBeUndefined();
    });
  });

  describe('updateStatuses', () => {
    it('deve atualizar múltiplas configurações em massa', async () => {
      const result = await firstValueFrom(service.updateStatuses(['COR-001', 'COR-002'], 'Ativo'));
      expect(result).toBe(true);
    });

    it('deve retornar true para lista vazia', async () => {
      const result = await firstValueFrom(service.updateStatuses([], 'Ativo'));
      expect(result).toBe(true);
    });

    it('deve ignorar IDs inexistentes', async () => {
      const result = await firstValueFrom(service.updateStatuses(['COR-999'], 'Ativo'));
      expect(result).toBe(true);
    });
  });

  describe('getConfigStatus', () => {
    it('deve retornar status de configuração existente', () => {
      const result = service.getConfigStatus('COR-001');
      expect(result).toBe('Inativo');
    });

    it('deve retornar undefined para ID inexistente', () => {
      const result = service.getConfigStatus('COR-999');
      expect(result).toBeUndefined();
    });
  });
});
