import { CanDeactivateFn } from '@angular/router';
import { IaCorrectionsPageComponent } from '../ia-corrections-page.component';

export const unsavedChangesGuard: CanDeactivateFn<IaCorrectionsPageComponent> = (component) => {
  if (component && component.hasUnsavedChanges()) {
    return window.confirm('Você tem alterações não salvas. Deseja descartá-las?');
  }
  return true;
};
