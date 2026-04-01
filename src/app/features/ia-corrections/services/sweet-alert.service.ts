import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class SweetAlertService {
  showLoading(message: string = 'Processando...'): void {
    Swal.fire({
      title: message,
      text: 'Aguarde enquanto os dados são processados.',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.showLoading(),
    });
  }

  closeLoading(): void {
    Swal.close();
  }

  async confirmAction(title: string, message: string): Promise<boolean> {
    const result = await Swal.fire({
      title,
      text: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#405189',
      cancelButtonColor: '#f06548',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    });
    return result.isConfirmed;
  }

  showSuccess(title: string, message: string): void {
    Swal.fire({ title, text: message, icon: 'success', confirmButtonColor: '#405189' });
  }

  showError(title: string, message: string): void {
    Swal.fire({ title, text: message, icon: 'error', confirmButtonColor: '#405189' });
  }
}
