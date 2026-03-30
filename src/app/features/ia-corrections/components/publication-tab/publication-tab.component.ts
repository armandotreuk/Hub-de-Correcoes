import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PublicationService } from '../../services/publication.service';
import { PublicationConfig } from '../../models/ia-corrections.models';

@Component({
  selector: 'app-publication-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './publication-tab.component.html',
  styleUrls: ['./publication-tab.component.css'],
})
export class PublicationTabComponent implements OnInit {
  private service = inject(PublicationService);

  configs = signal<PublicationConfig[]>([]);
  isLoading = signal<boolean>(true);

  currentPage = signal<number>(1);
  itemsPerPage = signal<number>(25);

  columnFilters = signal<{ [key: string]: string }>({
    businessUnitName: '',
    clusterName: '',
    courseName: '',
    activityTypeName: '',
    promptTitle: '',
    publicationStatus: '',
  });

  selectedIds = signal<Set<string>>(new Set());
  massActionNextStatus = signal<'Habilitado' | 'Desabilitado'>('Habilitado');

  filteredConfigs = computed(() => {
    let data = this.configs();
    const filters = this.columnFilters();

    data = data.filter((config) => {
      let matches = true;
      for (const key of Object.keys(filters)) {
        const term = filters[key].toLowerCase();
        if (term) {
          const val = config[key as keyof PublicationConfig];
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
    const validItems = displayed.filter((c) => c.correctionStatus !== 'Inativo');
    return validItems.length > 0 && validItems.every((c) => this.selectedIds().has(c.id));
  });

  ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    this.isLoading.set(true);
    this.service.getPublicationConfigs().subscribe((res) => {
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
    const config = this.configs().find((c) => c.id === id);
    if (config?.correctionStatus === 'Inativo') return; // Bloqueado

    const set = new Set(this.selectedIds());
    if (set.has(id)) set.delete(id);
    else set.add(id);
    this.selectedIds.set(set);
  }

  toggleAll(checked: boolean) {
    const set = new Set(this.selectedIds());
    this.paginatedConfigs().forEach((config) => {
      if (config.correctionStatus === 'Inativo') return;
      if (checked) set.add(config.id);
      else set.delete(config.id);
    });
    this.selectedIds.set(set);
  }

  toggleSingleStatus(config: PublicationConfig) {
    if (config.correctionStatus === 'Inativo') return; // RN24

    const newStatus = config.publicationStatus === 'Habilitado' ? 'Desabilitado' : 'Habilitado';
    if (!confirm(`Alterar status de publicação para ${newStatus}?`)) return;

    this.isLoading.set(true);
    this.service.updatePublicationStatus(config.id, newStatus).subscribe({
      next: () => {
        this.refreshData();
      },
      error: (err) => {
        this.isLoading.set(false);
        alert(err.message || 'Erro ao alterar status.');
      },
    });
  }

  onMassAction() {
    const ids = Array.from(this.selectedIds());
    if (!ids.length) return;

    const status = this.massActionNextStatus();
    if (!confirm(`Alterar status de ${ids.length} registro(s) para ${status}?`)) return;

    this.isLoading.set(true);
    this.service.updatePublicationStatuses(ids, status).subscribe({
      next: () => {
        this.massActionNextStatus.set(status === 'Habilitado' ? 'Desabilitado' : 'Habilitado');
        this.selectedIds.set(new Set());
        this.refreshData();
        alert(`Registros alterados para ${status} com sucesso.`);
      },
      error: (err) => {
        this.isLoading.set(false);
        alert(err.message || 'Erro ao alterar status em lote.');
      },
    });
  }

  updateThreshold(id: string, value: string) {
    const percentage = Number(value);
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      alert('Percentual inválido. Digite um valor entre 0 e 100.');
      return;
    }

    this.service.setPerformanceThreshold(id, percentage).subscribe(() => {
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
