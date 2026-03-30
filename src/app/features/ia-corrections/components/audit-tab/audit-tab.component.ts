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
  itemsPerPage = signal<number>(25);
  columnFilters = signal<{ [key: string]: string }>({
    unitName: '',
    activityName: '',
    clusterName: '',
    courseName: '',
    disciplineName: '',
    promptName: '',
    activatedBy: ''
  });
  sortColumn = signal<keyof AuditLog | ''>('');
  sortDirection = signal<'asc' | 'desc'>('asc');

  // Checkbox & mass action states
  selectedLogs = signal<Set<string>>(new Set());
  massActionNextStatus = signal<'Ativo' | 'Inativo'>('Ativo');

  // Computed: Filtering & Sorting (US16, US17)
  filteredLogs = computed(() => {
    let data = this.logs();
    const filters = this.columnFilters();

    // Filter
    data = data.filter(log => {
      let matches = true;
      for (const key of Object.keys(filters)) {
        const term = filters[key].toLowerCase();
        if (term) {
          const val = log[key as keyof AuditLog];
          if (!val || !(val.toString().toLowerCase().includes(term))) {
            matches = false;
            break;
          }
        }
      }
      return matches;
    });

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

  allSelected = computed(() => {
    const displayed = this.paginatedLogs();
    return displayed.length > 0 && displayed.every(log => this.selectedLogs().has(log.id));
  });

  updateFilter(col: string, val: string) {
    this.columnFilters.update(f => ({ ...f, [col]: val }));
    this.currentPage.set(1);
    this.selectedLogs.set(new Set()); // Clear selection on filter
  }

  toggleSelection(id: string) {
    const set = new Set(this.selectedLogs());
    if (set.has(id)) set.delete(id);
    else set.add(id);
    this.selectedLogs.set(set);
  }

  toggleAll(checked: boolean) {
    const set = new Set(this.selectedLogs());
    this.paginatedLogs().forEach(log => {
      if (checked) set.add(log.id);
      else set.delete(log.id);
    });
    this.selectedLogs.set(set);
  }

  onMassAction() {
    const ids = Array.from(this.selectedLogs());
    if (!ids.length) return;
    const status = this.massActionNextStatus();
    this.isLoading.set(true);
    this.service.updateStatuses(ids, status).subscribe(() => {
      this.massActionNextStatus.set(status === 'Ativo' ? 'Inativo' : 'Ativo');
      this.selectedLogs.set(new Set());
      this.refreshData();
      alert(`Registros ${status === 'Ativo' ? 'Ativados' : 'Desativados'} em lote com sucesso.`);
    });
  }

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
}
