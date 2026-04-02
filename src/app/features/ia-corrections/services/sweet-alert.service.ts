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
      html: message,
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
    Swal.fire({ title, html: message, icon: 'success', confirmButtonColor: '#405189' });
  }

  showError(title: string, message: string): void {
    Swal.fire({ title, html: message, icon: 'error', confirmButtonColor: '#405189' });
  }

  async selectOption(
    title: string,
    placeholder: string,
    options: { [key: string]: string },
  ): Promise<string | null> {
    const { value: selected } = await Swal.fire({
      title,
      input: 'select',
      inputOptions: options,
      inputPlaceholder: placeholder,
      showCancelButton: true,
      confirmButtonColor: '#405189',
      cancelButtonColor: '#f06548',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (value) {
            resolve();
          } else {
            resolve('Você precisa selecionar uma opção');
          }
        });
      },
    });

    return selected || null;
  }
}
