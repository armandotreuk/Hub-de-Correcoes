import {
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Prompt } from '../../../models/ia-corrections.models';

@Component({
  selector: 'app-prompt-detail-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prompt-detail-modal.component.html',
  styleUrls: ['./prompt-detail-modal.component.css'],
})
export class PromptDetailModalComponent implements OnChanges {
  @Input() prompt: Prompt | null = null;
  @Input() isOpen: boolean = false;
  @Input() allowEdit: boolean = false;

  @Output() close = new EventEmitter<void>();
  @Output() saveObservations = new EventEmitter<{ id: string; observations: string }>();
  @Output() savePrompt = new EventEmitter<{
    id: string;
    title: string;
    bodyEvaluation: string;
    bodyFeedback: string;
  }>();

  observations = signal('');
  editedTitle = signal('');
  editedBodyEvaluation = signal('');
  editedBodyFeedback = signal('');

  ngOnChanges(changes: SimpleChanges) {
    if (changes['prompt'] && this.prompt) {
      this.observations.set((this.prompt as any).observations || '');
      this.editedTitle.set(this.prompt.title);
      this.editedBodyEvaluation.set((this.prompt as any).bodyEvaluation || '');
      this.editedBodyFeedback.set((this.prompt as any).bodyFeedback || '');
    }
  }

  onClose() {
    this.close.emit();
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.onClose();
    }
  }

  saveObservationsClick() {
    if (this.prompt) {
      this.saveObservations.emit({
        id: this.prompt.id,
        observations: this.observations(),
      });
    }
  }

  savePromptClick() {
    if (this.prompt) {
      this.savePrompt.emit({
        id: this.prompt.id,
        title: this.editedTitle(),
        bodyEvaluation: this.editedBodyEvaluation(),
        bodyFeedback: this.editedBodyFeedback(),
      });
    }
  }
}
