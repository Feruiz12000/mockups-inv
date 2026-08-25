import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalShellComponent } from '../../shared/modal-shell.component';
import { HelpTooltipComponent } from '../../shared/help-tooltip.component';
import { UnidadSerializada } from '../../models/recepcion.models';

export type ResultadoLinea =
  | { tipo: 'coincide'; serial: string }
  | { tipo: 'otra-linea'; serial: string }
  | { tipo: 'no-coincide'; esperado: string; recibido: string };

@Component({
  selector: 'rcp-escanear-linea-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalShellComponent, HelpTooltipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './escanear-linea-dialog.component.html',
})
export class EscanearLineaDialogComponent {
  @Input() set unidad(v: UnidadSerializada | null) {
    this._unidad = v;
    this.codigo = '';
    this.feedback = null;
  }
  get unidad(): UnidadSerializada | null { return this._unidad; }
  private _unidad: UnidadSerializada | null = null;

  /** El padre resuelve el escaneo (solo él conoce el resto del documento). */
  @Input() resolver: ((codigo: string) => ResultadoLinea) | null = null;

  @Output() resuelto = new EventEmitter<ResultadoLinea>();
  @Output() cerrar = new EventEmitter<void>();

  codigo = '';
  feedback: { clase: string; html: string } | null = null;

  submit(): void {
    const code = this.codigo.trim().toUpperCase();
    if (!code || !this._unidad || !this.resolver) return;
    const r = this.resolver(code);

    if (r.tipo === 'coincide') {
      this.feedback = { clase: 'ok', html: `Coincide con lo esperado: <b>${code}</b> queda <b>confirmada</b>.` };
      this.codigo = '';
    } else if (r.tipo === 'otra-linea') {
      this.feedback = { clase: 'warn', html: `<b>${code}</b> sí pertenece a este documento, pero a <b>otra línea</b>. Escanéala en el campo general para confirmarla.` };
      this.codigo = '';
    } else {
      this.feedback = { clase: 'err', html: `Registrada la discrepancia: se esperaba <b>${r.esperado}</b> y llegó <b>${r.recibido}</b>. <b>Ninguna de las dos se recibe</b> (§14.1); ambas van a reconciliación.` };
      this.codigo = '';
    }
    this.resuelto.emit(r);
  }
}
