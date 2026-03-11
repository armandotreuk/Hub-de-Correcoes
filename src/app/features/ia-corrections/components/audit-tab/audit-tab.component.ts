import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IaConfigMockService, AuditLog } from '../../services/ia-config.service';

@Component({
  selector: 'app-audit-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audit-tab.component.html',
  styleUrls: ['./audit-tab.component.css']
})
export class AuditTabComponent implements OnInit {
  private service = inject(IaConfigMockService);

  // States
  logs = signal<AuditLog[]>([]);
  isLoading = signal<boolean>(true);

  // Pagination & Sorting (US08)
  currentPage = signal<number>(1);
  itemsPerPage = signal<number>(10);
  searchTerm = signal<string>('');
  sortColumn = signal<keyof AuditLog | ''>('');
  sortDirection = signal<'asc' | 'desc'>('asc');

  // Computed: Filtering & Sorting (US16, US17)
  filteredLogs = computed(() => {
    let data = this.logs();
    const term = this.searchTerm().toLowerCase();

    // Filter
    if (term) {
      data = data.filter(log => 
         log.unitName.toLowerCase().includes(term) ||
         log.activityName.toLowerCase().includes(term) ||
         log.activatedBy.toLowerCase().includes(term) ||
         log.id.toLowerCase().includes(term)
      );
    }

    // Sort
    const col = this.sortColumn();
    if (col) {
      data = [...data].sort((a, b) => {
        const valA = a[col];
        const valB = b[col];
        if (valA < valB) return this.sortDirection() === 'asc' ? -1 : 1;
        if (valA > valB) return this.sortDirection() === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return data;
  });

  // Computed: Pagination (US18)
  paginatedLogs = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return this.filteredLogs().slice(start, end);
  });

  totalPages = computed(() => {
    return Math.max(1, Math.ceil(this.filteredLogs().length / this.itemsPerPage()));
  });

  ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    this.isLoading.set(true);
    this.service.getAuditLogs().subscribe(res => {
      this.logs.set(res);
      this.isLoading.set(false);
    });
  }

  // Sort Action
  toggleSort(column: keyof AuditLog) {
    if (this.sortColumn() === column) {
      // Toggle direction
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
  }

  // Pagination Actions
  prevPage() {
    if (this.currentPage() > 1) this.currentPage.set(this.currentPage() - 1);
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) this.currentPage.set(this.currentPage() + 1);
  }

  setItemsPerPage(size: number) {
    this.itemsPerPage.set(size);
    this.currentPage.set(1);
  }

  // Disable rule (US09)
  onDisable(log: AuditLog) {
    if (confirm(`Tem clareza em inativar a configuração ${log.id} para ${log.unitName}?`)) {
      this.isLoading.set(true);
      this.service.disableConfig(log.id).subscribe(() => {
         this.refreshData();
         alert('Regra desativada com sucesso.');
      });
    }
  }
}
