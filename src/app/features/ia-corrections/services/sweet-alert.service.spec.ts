import { vi, describe, it, beforeEach, expect, afterEach } from 'vitest';
import { SweetAlertService } from './sweet-alert.service';
import Swal from 'sweetalert2';

describe('SweetAlertService', () => {
  let service: SweetAlertService;

  beforeEach(() => {
    service = new SweetAlertService();
    vi.spyOn(Swal, 'fire').mockResolvedValue({
      isConfirmed: true,
      isDenied: false,
      isDismissed: false,
      value: null,
    } as any);
    vi.spyOn(Swal, 'close');
    vi.spyOn(Swal, 'showLoading');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('showLoading', () => {
    it('deve exibir loading com mensagem padrão', () => {
      service.showLoading();
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Processando...',
          allowOutsideClick: false,
        }),
      );
    });

    it('deve exibir loading com mensagem personalizada', () => {
      service.showLoading('Carregando dados...');
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Carregando dados...',
        }),
      );
    });
  });

  describe('closeLoading', () => {
    it('deve fechar o loading', () => {
      service.closeLoading();
      expect(Swal.close).toHaveBeenCalled();
    });
  });

  describe('confirmAction', () => {
    it('deve retornar true quando confirmado', async () => {
      vi.spyOn(Swal, 'fire').mockResolvedValue({
        isConfirmed: true,
        isDenied: false,
        isDismissed: false,
        value: null,
      } as any);
      const result = await service.confirmAction('Título', 'Mensagem');
      expect(result).toBe(true);
    });

    it('deve retornar false quando cancelado', async () => {
      vi.spyOn(Swal, 'fire').mockResolvedValue({
        isConfirmed: false,
        isDenied: false,
        isDismissed: true,
        value: null,
      } as any);
      const result = await service.confirmAction('Título', 'Mensagem');
      expect(result).toBe(false);
    });
  });

  describe('showSuccess', () => {
    it('deve exibir alerta de sucesso', () => {
      service.showSuccess('Sucesso', 'Operação concluída');
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Sucesso',
          icon: 'success',
        }),
      );
    });
  });

  describe('showError', () => {
    it('deve exibir alerta de erro', () => {
      service.showError('Erro', 'Algo deu errado');
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Erro',
          icon: 'error',
        }),
      );
    });
  });

  describe('selectOption', () => {
    it('deve retornar opção selecionada', async () => {
      vi.spyOn(Swal, 'fire').mockResolvedValue({ isConfirmed: true, value: 'option1' } as any);
      const result = await service.selectOption('Selecione', 'Escolha...', { option1: 'Opção 1' });
      expect(result).toBe('option1');
    });

    it('deve retornar null quando cancelado', async () => {
      vi.spyOn(Swal, 'fire').mockResolvedValue({ isConfirmed: false, value: null } as any);
      const result = await service.selectOption('Selecione', 'Escolha...', { option1: 'Opção 1' });
      expect(result).toBeNull();
    });
  });
});
