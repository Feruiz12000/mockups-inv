import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalShellComponent } from '../../shared/modal-shell.component';
import { HelpTooltipComponent } from '../../shared/help-tooltip.component';

/** Qué se está anotando: el motivo de una unidad o el comentario de un rechazado. */
export type MotivoKind = 'motivo' | 'comentario';

export interface MotivoDialogData {
  kind: MotivoKind;
  material: string;
  serial: string;
  texto: string;
}

const PRESETS: Record<MotivoKind, string[]> = {
  motivo: [
    'No llegó en el envío',
    'Llegó con la caja dañada',
    'Equipo golpeado / no enciende',
    'Cantidad menor a la esperada',
  ],
  comentario: [
    'No pertenece a este envío',
    'Serial ilegible / mal escaneado',
    'Llegó de más',
    'Corresponde a otro contratista',
  ],
};

/**
 * Ventana única para justificar una discrepancia.
 * Se usa igual para una unidad del documento ("motivo") y para un serial
 * rechazado §14.1 ("comentario"); solo cambian textos y atajos.
 */
@Component({
  selector: 'rcp-motivo-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalShellComponent, HelpTooltipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './motivo-dialog.component.html',
})
export class MotivoDialogComponent {
  @Input() set data(v: MotivoDialogData | null) {
    this._data = v;
    this.texto = v?.texto ?? '';
  }
  get data(): MotivoDialogData | null { return this._data; }
  private _data: MotivoDialogData | null = null;

  @Output() guardar = new EventEmitter<string>();
  @Output() cancelar = new EventEmitter<void>();

  texto = '';

  get kind(): MotivoKind { return this._data?.kind ?? 'motivo'; }
  get esRechazado(): boolean { return this.kind === 'comentario'; }
  get presets(): string[] { return PRESETS[this.kind]; }
  get valido(): boolean { return this.texto.trim().length > 0; }

  usarPreset(p: string): void { this.texto = p; }

  onGuardar(): void {
    if (!this.valido) return;
    this.guardar.emit(this.texto.trim());
  }
}
