import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { unsavedChangesGuard } from './features/ia-corrections/guards/unsaved-changes.guard';

const routes: Routes = [
  {
    path: 'correcoes-ia',
    loadComponent: () =>
      import('./features/ia-corrections/ia-corrections-page.component').then(
        (c) => c.IaCorrectionsPageComponent,
      ),
    canDeactivate: [unsavedChangesGuard],
  },
];

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)],
};
