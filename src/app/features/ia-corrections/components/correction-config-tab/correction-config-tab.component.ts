import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CorrectionConfigService } from '../../services/correction-config.service';
import { CorrectionConfig } from '../../models/ia-corrections.models';

@Component({
  selector: 'app-correction-config-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './correction-config-tab.component.html',
  styleUrls: ['./correction-config-tab.component.css'],
})
export class CorrectionConfigTabComponent implements OnInit {
  private service = inject(CorrectionConfigService);

  configs = signal<CorrectionConfig[]>([]);
  isLoading = signal<boolean>(true);

  currentPage = signal<number>(1);
  itemsPerPage = signal<number>(25);

  columnFilters = signal<{ [key: string]: string }>({
    businessUnitName: '',
    clusterName: '',
    courseName: '',
    activityTypeName: '',
    promptTitle: '',
    correctionStatus: '',
  });

  selectedIds = signal<Set<string>>(new Set());
  massActionNextStatus = signal<'Ativo' | 'Inativo'>('Ativo');

  filteredConfigs = computed(() => {
    let data = this.configs();
    const filters = this.columnFilters();

    data = data.filter((config) => {
      let matches = true;
      for (const key of Object.keys(filters)) {
        const term = filters[key].toLowerCase();
        if (term) {
          const val = config[key as keyof CorrectionConfig];
          if (!val || !val.toString().toLowerCase().includes(term)) {
            matches = false;
            break;
          }
        }
      }
      return matches;
    });

    return data;
  });

  paginatedConfigs = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return this.filteredConfigs().slice(start, end);
  });

  totalPages = computed(() => {
    return Math.max(1, Math.ceil(this.filteredConfigs().length / this.itemsPerPage()));
  });

  allSelected = computed(() => {
    const displayed = this.paginatedConfigs();
    return displayed.length > 0 && displayed.every((config) => this.selectedIds().has(config.id));
  });

  ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    this.isLoading.set(true);
    this.service.getConfigs().subscribe((res) => {
      this.configs.set(res);
      this.isLoading.set(false);
    });
  }

  updateFilter(col: string, val: string) {
    this.columnFilters.update((f) => ({ ...f, [col]: val }));
    this.currentPage.set(1);
    this.selectedIds.set(new Set());
  }

  toggleSelection(id: string) {
    const set = new Set(this.selectedIds());
    if (set.has(id)) set.delete(id);
    else set.add(id);
    this.selectedIds.set(set);
  }

  toggleAll(checked: boolean) {
    const set = new Set(this.selectedIds());
    this.paginatedConfigs().forEach((config) => {
      if (checked) set.add(config.id);
      else set.delete(config.id);
    });
    this.selectedIds.set(set);
  }

  onMassAction() {
    const ids = Array.from(this.selectedIds());
    if (!ids.length) return;

    const status = this.massActionNextStatus();
    if (!confirm(`Alterar status de ${ids.length} registro(s) para ${status}?`)) return;

    this.isLoading.set(true);
    this.service.updateStatuses(ids, status).subscribe(() => {
      this.massActionNextStatus.set(status === 'Ativo' ? 'Inativo' : 'Ativo');
      this.selectedIds.set(new Set());
      this.refreshData();
      alert(`Registros alterados para ${status} com sucesso.`);
    });
  }

  toggleSingleStatus(config: CorrectionConfig) {
    const newStatus = config.correctionStatus === 'Ativo' ? 'Inativo' : 'Ativo';
    if (!confirm(`Alterar status para ${newStatus}?`)) return;

    this.service.updateStatus(config.id, newStatus).subscribe(() => {
      this.refreshData();
    });
  }

  prevPage() {
    if (this.currentPage() > 1) this.currentPage.set(this.currentPage() - 1);
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) this.currentPage.set(this.currentPage() + 1);
  }

  setItemsPerPage(size: number) {
    this.itemsPerPage.set(Number(size));
    this.currentPage.set(1);
  }
}
