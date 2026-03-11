import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParameterizationTabComponent } from './components/parameterization-tab/parameterization-tab.component';
import { AuditTabComponent } from './components/audit-tab/audit-tab.component';

@Component({
  selector: 'app-ia-corrections-page',
  standalone: true,
  imports: [CommonModule, ParameterizationTabComponent, AuditTabComponent],
  templateUrl: './ia-corrections-page.component.html',
  styleUrls: ['./ia-corrections-page.component.css']
})
export class IaCorrectionsPageComponent {
  activeTab = signal<'param' | 'audit'>('param');

  setTab(tab: 'param' | 'audit') {
    this.activeTab.set(tab);
  }
}
