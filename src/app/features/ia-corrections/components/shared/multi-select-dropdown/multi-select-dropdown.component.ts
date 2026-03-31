import {
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  HostListener,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface MultiSelectOption {
  value: any;
  label: string;
}

@Component({
  selector: 'app-multi-select-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './multi-select-dropdown.component.html',
  styleUrls: ['./multi-select-dropdown.component.css'],
})
export class MultiSelectDropdownComponent {
  @Input() options: MultiSelectOption[] = [];
  @Input() label: string = '';
  @Input() placeholder: string = 'Buscar...';
  @Input() selectedValues: any[] = [];

  @Output() selectionChange = new EventEmitter<any[]>();

  isOpen = signal(false);
  searchTerm = signal('');

  constructor(private el: ElementRef) {}

  get filteredOptions(): MultiSelectOption[] {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.options;
    return this.options.filter((opt: MultiSelectOption) => opt.label.toLowerCase().includes(term));
  }

  get allSelected(): boolean {
    const visible = this.filteredOptions;
    if (visible.length === 0) return false;
    return visible.every((opt: MultiSelectOption) => this.selectedValues.includes(opt.value));
  }

  get someSelected(): boolean {
    const visible = this.filteredOptions;
    if (this.allSelected) return false;
    return visible.some((opt: MultiSelectOption) => this.selectedValues.includes(opt.value));
  }

  get displayText(): string {
    if (this.selectedValues.length === 0) return this.placeholder;
    if (this.selectedValues.length === 1) {
      const opt = this.options.find((o: MultiSelectOption) => o.value === this.selectedValues[0]);
      return opt ? opt.label : `${this.selectedValues.length} selecionado(s)`;
    }
    return `${this.selectedValues.length} selecionado(s)`;
  }

  toggleDropdown() {
    this.isOpen.update((v) => !v);
    if (!this.isOpen()) {
      this.searchTerm.set('');
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
      this.searchTerm.set('');
    }
  }

  toggleSelectAll() {
    const visible = this.filteredOptions;
    let newValues: any[];

    if (this.allSelected) {
      newValues = this.selectedValues.filter(
        (v) => !visible.some((opt: MultiSelectOption) => opt.value === v),
      );
    } else {
      const existingSet = new Set(this.selectedValues);
      visible.forEach((opt: MultiSelectOption) => existingSet.add(opt.value));
      newValues = Array.from(existingSet);
    }

    this.selectedValues = newValues;
    this.selectionChange.emit(newValues);
  }

  toggleOption(value: any) {
    let newValues: any[];
    if (this.selectedValues.includes(value)) {
      newValues = this.selectedValues.filter((v) => v !== value);
    } else {
      newValues = [...this.selectedValues, value];
    }
    this.selectedValues = newValues;
    this.selectionChange.emit(newValues);
  }

  isSelected(value: any): boolean {
    return this.selectedValues.includes(value);
  }
}
