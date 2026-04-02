import { Component, signal, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

// Existing Tabs
import { PromptRegistrationTabComponent } from './components/prompt-registration-tab/prompt-registration-tab.component';
import { PromptLinkingTabComponent } from './components/prompt-linking-tab/prompt-linking-tab.component';
import { CorrectionConfigTabComponent } from './components/correction-config-tab/correction-config-tab.component';
import { AuditTabComponent } from './components/audit-tab/audit-tab.component';
import { PublicationTabComponent } from './components/publication-tab/publication-tab.component';

// Prototype Tab
import { MatrixConfigurationTabComponent } from './components/matrix-configuration-tab/matrix-configuration-tab.component';

type TabType =
  | 'prompt-registration'
  | 'prompt-linking'
  | 'correction-config'
  | 'audit'
  | 'publication'
  | 'matrix-configuration';

@Component({
  selector: 'app-ia-corrections-page',
  standalone: true,
  imports: [
    CommonModule,
    AuditTabComponent,
    CorrectionConfigTabComponent,
    MatrixConfigurationTabComponent,
    PromptRegistrationTabComponent,
    PromptLinkingTabComponent,
    PublicationTabComponent,
  ],
  templateUrl: './ia-corrections-page.component.html',
  styleUrls: ['./ia-corrections-page.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IaCorrectionsPageComponent {
  @ViewChild(PromptRegistrationTabComponent) promptRegistrationTab?: PromptRegistrationTabComponent;

  activeTab = signal<TabType>('prompt-registration');

  setTab(tab: TabType) {
    if (this.activeTab() === 'prompt-registration' && this.promptRegistrationTab) {
      if (this.promptRegistrationTab.hasUnsavedChanges()) {
        const confirmLeave = window.confirm('Você tem alterações não salvas. Deseja descartá-las?');
        if (!confirmLeave) {
          return;
        }
      }
    }
    this.activeTab.set(tab);
  }

  hasUnsavedChanges(): boolean {
    if (this.activeTab() === 'prompt-registration' && this.promptRegistrationTab) {
      return this.promptRegistrationTab.hasUnsavedChanges();
    }
    return false;
  }
}
