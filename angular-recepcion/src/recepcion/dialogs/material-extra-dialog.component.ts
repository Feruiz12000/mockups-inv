import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalShellComponent } from '../../shared/modal-shell.component';
import { HelpTooltipComponent } from '../../shared/help-tooltip.component';
import { MaterialExtra } from '../../models/recepcion.models';

/**
 * Alta/edición de un material NO serializado que llegó y no está en el 351.
 * No se puede confirmar (§14.1): se guarda como evidencia.
 */
@Component({
  selector: 'rcp-material-extra-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalShellComponent, HelpTooltipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './material-extra-dialog.component.html',
})
export class MaterialExtraDialogComponent {
  /** null = cerrado · objeto vacío = alta · objeto con id = edición */
  @Input() set data(v: MaterialExtra | null) {
    this._data = v;
    this.material = v?.material ?? '';
    this.cantidad = v?.cantidad ?? null;
    this.uom = v?.uom ?? 'UND';
    this.comentario = v?.comentario ?? '';
  }
  get data(): MaterialExtra | null { return this._data; }
  private _data: MaterialExtra | null = null;

  @Output() guardar = new EventEmitter<Omit<MaterialExtra, 'id'>>();
  @Output() cancelar = new EventEmitter<void>();

  readonly uoms = ['UND', 'FT', 'MT', 'ROL', 'KG', 'CAJA'];
  readonly presets = [
    'Llegó de más en el envío',
    'No corresponde a este documento',
    'Sobrante del envío anterior',
    'Enviado por error desde el warehouse',
  ];

  material = '';
  cantidad: number | null = null;
  uom = 'UND';
  comentario = '';

  get edita(): boolean { return !!this._data?.id; }
  get valido(): boolean {
    return this.material.trim().length > 0 && this.cantidad != null && this.cantidad > 0;
  }

  onGuardar(): void {
    if (!this.valido) return;
    this.guardar.emit({
      material: this.material.trim(),
      cantidad: this.cantidad!,
      uom: this.uom,
      comentario: this.comentario.trim(),
    });
  }
}
