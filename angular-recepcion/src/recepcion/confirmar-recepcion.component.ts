import {
  Component, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalShellComponent } from '../shared/modal-shell.component';
import { HelpTooltipComponent } from '../shared/help-tooltip.component';
import { MotivoDialogComponent, MotivoDialogData } from './dialogs/motivo-dialog.component';
import { MaterialExtraDialogComponent } from './dialogs/material-extra-dialog.component';
import { EscanearLineaDialogComponent, ResultadoLinea } from './dialogs/escanear-linea-dialog.component';
import {
  ConfirmacionRequest, DetalleRecepcion, MaterialExtra, MaterialNoSerializado,
  SerialRechazado, UnidadSerializada,
} from '../models/recepcion.models';

type Filtro = 'pendientes' | 'confirmados' | 'discrepancia' | 'todos';
type Toast = { clase: string; icono: string; texto: string; codigo?: string };

/**
 * Fila de la tabla unificada: una unidad del documento o un serial rechazado
 * (§14.1). Se modela con dos campos opcionales en vez de una unión discriminada
 * porque Angular no estrecha uniones en la plantilla; con `*ngIf="f.unidad as u"`
 * el tipado sí funciona bajo strictTemplates.
 */
export interface Fila {
  unidad?: UnidadSerializada;
  rechazado?: SerialRechazado;
}

/**
 * Ventana "Confirmar recepción" del documento 351.
 *
 * Reglas que implementa (spec §11.5 · §14.1):
 *  - Solo se confirman unidades que pertenecen al documento.
 *  - Un serial ajeno se rechaza y se muestra como una discrepancia más.
 *  - Toda discrepancia exige un motivo escrito.
 *  - Un material no serializado que no está en el documento se registra como
 *    evidencia, nunca como recibido.
 */
@Component({
  selector: 'rcp-confirmar-recepcion',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ModalShellComponent, HelpTooltipComponent,
    MotivoDialogComponent, MaterialExtraDialogComponent, EscanearLineaDialogComponent,
  ],
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './confirmar-recepcion.component.html',
  styleUrls: ['./confirmar-recepcion.component.scss'],
})
export class ConfirmarRecepcionComponent {

  @Input() set detalle(v: DetalleRecepcion | null) {
    this._detalle = v;
    this.unidades = v ? v.unidades.map(u => ({ ...u })) : [];
    this.rechazados = v ? v.rechazados.map(r => ({ ...r })) : [];
    this.noSerializados = v ? v.noSerializados.map(m => ({ ...m })) : [];
    this.extras = v ? v.extras.map(e => ({ ...e })) : [];
    this.filtro = 'pendientes';
    this.busqueda = '';
    this.refrescar();
    setTimeout(() => this.enfocarEscaner(), 60);
  }
  get detalle(): DetalleRecepcion | null { return this._detalle; }
  private _detalle: DetalleRecepcion | null = null;

  @Output() confirmar = new EventEmitter<ConfirmacionRequest>();
  @Output() cerrar = new EventEmitter<void>();

  @ViewChild('escaner') escanerRef?: ElementRef<HTMLInputElement>;

  unidades: UnidadSerializada[] = [];
  rechazados: SerialRechazado[] = [];
  noSerializados: MaterialNoSerializado[] = [];
  extras: MaterialExtra[] = [];

  filtro: Filtro = 'pendientes';
  busqueda = '';
  codigo = '';
  toast: Toast | null = null;
  private toastT: any;

  filas: Fila[] = [];
  confirmados = 0;
  pendientes = 0;
  discrepancias = 0;          // unidades con discrepancia + seriales rechazados

  // diálogos
  motivoData: MotivoDialogData | null = null;
  private motivoTarget:
    | { kind: 'unidad'; ref: UnidadSerializada }
    | { kind: 'rechazado'; ref: SerialRechazado }
    | null = null;
  materialData: MaterialExtra | null = null;
  private materialTarget: MaterialExtra | null = null;
  unidadLinea: UnidadSerializada | null = null;

  // ---------------------------------------------------------------- escaneo
  enfocarEscaner(): void { this.escanerRef?.nativeElement.focus(); }

  escanear(): void {
    const code = this.codigo.trim().toUpperCase();
    this.codigo = '';
    this.enfocarEscaner();
    if (!code) return;

    const u = this.unidades.find(x => x.serial.toUpperCase() === code);

    // Ya confirmada: se omite, no cuenta doble.
    if (u && u.estado === 'confirmado') { this.mostrarToast('dup', code); return; }

    // Fuera del documento (§14.1): rechazo inmediato + evidencia.
    if (!u) {
      const prev = this.rechazados.find(r => r.serial.toUpperCase() === code);
      if (prev) { prev.intentos++; this.mostrarToast('dup', code); this.refrescar(); return; }
      this.rechazados.push({
        serial: code,
        razon: 'Serial / MAC no incluido en el documento de origen',
        intentos: 1,
        hora: this.ahora(),
      });
      this.mostrarToast('fuera', code);
      this.refrescar();
      return;
    }

    // Match: confirmación inmediata.
    u.estado = 'confirmado';
    u.novedad = false;
    u.motivo = undefined;
    this.mostrarToast('confirmado', code);
    this.refrescar();
  }

  private mostrarToast(kind: 'confirmado' | 'novedad' | 'fuera' | 'dup', codigo?: string): void {
    const map: Record<string, Toast> = {
      confirmado: { clase: 'chip-green', icono: 'check_circle', texto: 'Confirmado' },
      novedad: { clase: 'chip-amber', icono: 'report_problem', texto: 'Con novedad' },
      fuera: { clase: 'chip-red', icono: 'block', texto: 'Fuera del documento' },
      dup: { clase: 'chip-grey', icono: 'content_copy', texto: 'Duplicado omitido' },
    };
    this.toast = { ...map[kind], codigo };
    clearTimeout(this.toastT);
    this.toastT = setTimeout(() => (this.toast = null), 2200);
  }

  // ---------------------------------------------------- filtros y contadores
  setFiltro(f: Filtro): void { this.filtro = f; this.refrescar(); }

  refrescar(): void {
    this.confirmados = this.unidades.filter(u => u.estado === 'confirmado').length;
    this.pendientes = this.unidades.filter(u => u.estado === 'pendiente').length;
    const discUnidades = this.unidades.filter(u => u.estado === 'discrepancia').length;
    this.discrepancias = discUnidades + this.rechazados.length;

    const q = this.busqueda.trim().toUpperCase();
    const coincide = (txt: string) => !q || txt.toUpperCase().includes(q);

    const filas: Fila[] = [];
    for (const u of this.unidades) {
      const okF = this.filtro === 'todos' ||
        (this.filtro === 'pendientes' && u.estado === 'pendiente') ||
        (this.filtro === 'confirmados' && u.estado === 'confirmado') ||
        (this.filtro === 'discrepancia' && u.estado === 'discrepancia');
      const texto = u.numero + ' ' + u.material + ' ' + u.materialCodigo + ' ' +
                    u.serial + ' ' + (u.motivo || '');
      if (okF && coincide(texto)) filas.push({ unidad: u });
    }
    // Los rechazados solo aparecen donde tiene sentido: son una discrepancia.
    if (this.filtro === 'discrepancia' || this.filtro === 'todos') {
      for (const r of this.rechazados) {
        const texto = r.serial + ' ' + r.razon + ' ' + (r.comentario || '');
        if (coincide(texto)) filas.push({ rechazado: r });
      }
    }
    this.filas = filas;
  }

  get total(): number { return this.unidades.length; }

  get porcentaje(): number {
    return this.total ? Math.round(this.confirmados * 100 / this.total) : 0;
  }

  get totalFilas(): number { return this.unidades.length + this.rechazados.length; }

  /** Parcial mientras quede algo sin confirmar; Total cuando todo cuadró. */
  get tipoConfirmacion(): 'Parcial' | 'Total' {
    const todoOk = this.confirmados === this.total
      && this.rechazados.length === 0
      && this.extras.length === 0
      && this.noSerializados.every(m => m.recibido === m.esperado);
    return todoOk ? 'Total' : 'Parcial';
  }

  // ------------------------------------------------------- chip de la unidad
  chipUnidad(u: UnidadSerializada): { clase: string; icono: string; texto: string; title: string } {
    if (u.estado === 'confirmado') {
      return { clase: 'chip-green', icono: 'check_circle', texto: 'Confirmado', title: '' };
    }
    if (u.estado === 'discrepancia' && u.recibido) {
      return {
        clase: 'chip-red', icono: 'swap_horiz', texto: 'No coincide',
        title: 'Se esperaba ' + u.serial + ' y llegó ' + u.recibido +
               '. Ninguna de las dos se recibe (§14.1).',
      };
    }
    if (u.estado === 'discrepancia' && u.novedad) {
      return {
        clase: 'chip-amber', icono: 'report_problem', texto: 'Con novedad',
        title: 'Llegó con novedad/daño — no se recibe; va a reconciliación (§11.5.6).',
      };
    }
    if (u.estado === 'discrepancia') {
      return { clase: 'chip-amber', icono: 'error', texto: 'Discrepancia', title: 'No llegó en el envío.' };
    }
    return { clase: 'chip-grey', icono: '', texto: 'Pendiente', title: '' };
  }

  tooltipMarcar(u: UnidadSerializada): string {
    if (u.estado === 'discrepancia') {
      return 'Quitar la discrepancia de ' + u.serial + ' y devolverla a Pendiente';
    }
    if (u.estado === 'confirmado') {
      return 'Revertir la confirmación de ' + u.serial + ' y registrar una discrepancia indicando el motivo';
    }
    return 'Registrar una discrepancia en ' + u.serial +
           ': se abrirá una ventana para indicar el motivo';
  }

  // ------------------------------------------------------------ discrepancia
  marcar(u: UnidadSerializada): void {
    if (u.estado === 'discrepancia') {          // revertir
      u.estado = 'pendiente';
      u.novedad = false;
      u.motivo = undefined;
      if (u.recibido) {
        this.rechazados = this.rechazados.filter(r => r.vinculadoA !== u.serial);
        u.recibido = undefined;
      }
      this.refrescar();
      return;
    }
    this.abrirMotivoUnidad(u);
  }

  abrirMotivoUnidad(u: UnidadSerializada): void {
    this.motivoTarget = { kind: 'unidad', ref: u };
    this.motivoData = { kind: 'motivo', material: u.material, serial: u.serial, texto: u.motivo || '' };
  }

  abrirComentarioRechazado(r: SerialRechazado): void {
    this.motivoTarget = { kind: 'rechazado', ref: r };
    this.motivoData = {
      kind: 'comentario',
      material: 'No pertenece al documento 351',
      serial: r.serial,
      texto: r.comentario || '',
    };
  }

  guardarMotivo(texto: string): void {
    const t = this.motivoTarget;
    if (!t) return;
    if (t.kind === 'unidad') {
      if (t.ref.estado === 'confirmado') t.ref.novedad = true;
      t.ref.estado = 'discrepancia';
      t.ref.motivo = texto;
    } else {
      t.ref.comentario = texto;
    }
    this.motivoData = null;
    this.motivoTarget = null;
    this.refrescar();
  }

  quitarRechazado(r: SerialRechazado): void {
    this.rechazados = this.rechazados.filter(x => x !== r);
    this.refrescar();
  }

  // ------------------------------------------------ escaneo contra una línea
  abrirLinea(u: UnidadSerializada): void { this.unidadLinea = u; }

  resolverLinea = (codigo: string): ResultadoLinea => {
    const u = this.unidadLinea!;
    if (codigo === u.serial.toUpperCase()) {
      u.estado = 'confirmado';
      u.recibido = undefined;
      this.refrescar();
      return { tipo: 'coincide', serial: codigo };
    }
    const otra = this.unidades.find(x => x.serial.toUpperCase() === codigo);
    if (otra) return { tipo: 'otra-linea', serial: codigo };

    // Sustitución: ninguna de las dos se recibe.
    u.estado = 'discrepancia';
    u.recibido = codigo;
    u.motivo = 'Llegó ' + codigo + ' en lugar de la unidad esperada';
    this.rechazados.push({
      serial: codigo,
      razon: 'Llegó en lugar de ' + u.serial + ' — no pertenece al documento',
      intentos: 1,
      hora: this.ahora(),
      vinculadoA: u.serial,
    });
    this.refrescar();
    return { tipo: 'no-coincide', esperado: u.serial, recibido: codigo };
  };

  // ------------------------------------------------- materiales no incluidos
  abrirMaterialExtra(m?: MaterialExtra): void {
    this.materialTarget = m || null;
    this.materialData = m || { id: '', material: '', cantidad: 0, uom: 'UND', comentario: '' };
  }

  guardarMaterialExtra(v: Omit<MaterialExtra, 'id'>): void {
    if (this.materialTarget) {
      Object.assign(this.materialTarget, v);
    } else {
      this.extras.push({ id: 'tmp-' + Date.now(), ...v });
    }
    this.materialData = null;
    this.materialTarget = null;
  }

  quitarMaterialExtra(m: MaterialExtra): void {
    this.extras = this.extras.filter(x => x !== m);
  }

  // ----------------------------------------------- cantidades no serializadas
  estadoCantidad(m: MaterialNoSerializado): { clase: string; icono: string; texto: string } {
    if (m.recibido == null || isNaN(m.recibido)) {
      return { clase: 'chip-grey', icono: '', texto: 'Pendiente' };
    }
    if (m.recibido === m.esperado) {
      return { clase: 'chip-green', icono: 'check_circle', texto: 'Completa' };
    }
    if (m.recibido < m.esperado) {
      return {
        clase: 'chip-amber', icono: 'error',
        texto: 'Faltante −' + (m.esperado - m.recibido) + ' ' + m.uom,
      };
    }
    return {
      clase: 'chip-red', icono: 'block',
      texto: 'Excede +' + (m.recibido - m.esperado) + ' ' + m.uom + ' — no permitido',
    };
  }

  /** Regla dura: una cantidad por encima de lo asignado bloquea el 101. */
  get puedeConfirmar(): boolean {
    return this.noSerializados.every(m => m.recibido == null || m.recibido <= m.esperado);
  }

  // ------------------------------------------------------------ confirmación
  generar101(): void {
    if (!this._detalle || !this.puedeConfirmar) return;
    this.confirmar.emit({
      documentoId: this._detalle.documento.id,
      tipo: this.tipoConfirmacion,
      confirmados: this.unidades.filter(u => u.estado === 'confirmado').map(u => u.serial),
      discrepancias: this.unidades
        .filter(u => u.estado === 'discrepancia')
        .map(u => ({ serial: u.serial, motivo: u.motivo || '', recibido: u.recibido })),
      rechazados: this.rechazados.map(r => ({
        serial: r.serial, razon: r.razon, comentario: r.comentario, intentos: r.intentos,
      })),
      noSerializados: this.noSerializados
        .filter(m => m.recibido != null)
        .map(m => ({ codigo: m.codigo, recibido: m.recibido as number, uom: m.uom })),
      extras: this.extras.map(e => ({
        material: e.material, cantidad: e.cantidad, uom: e.uom, comentario: e.comentario,
      })),
    });
  }

  private ahora(): string {
    const d = new Date();
    return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  }

  trackFila = (_: number, f: Fila) => f.unidad ? f.unidad.serial : f.rechazado!.serial;
}
