import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HelpTooltipComponent } from '../shared/help-tooltip.component';
import { ConfirmarRecepcionComponent } from './confirmar-recepcion.component';
import { RECEPCION_API, RecepcionApi } from '../services/recepcion.service';
import {
  ConfirmacionRequest, DetalleRecepcion, DocumentoTransito, FiltroDocumentos,
} from '../models/recepcion.models';

type Tab = 'transito' | 'confirmados' | 'discrepancias';

/**
 * Pantalla del módulo: lista de documentos 351 en tránsito + acceso a la
 * ventana de confirmación. HU-INV-02 · spec §11.5.
 */
@Component({
  selector: 'rcp-recepcion-page',
  standalone: true,
  imports: [CommonModule, FormsModule, HelpTooltipComponent, ConfirmarRecepcionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './recepcion-page.component.html',
})
export class RecepcionPageComponent implements OnInit {

  tab: Tab = 'transito';
  cargando = false;
  documentos: DocumentoTransito[] = [];
  filtro: FiltroDocumentos = { q: '', estado: 'todos', destino: '', fecha: '' };

  /** Detalle abierto en la ventana de confirmación (null = cerrada). */
  detalle: DetalleRecepcion | null = null;

  constructor(
    @Inject(RECEPCION_API) private api: RecepcionApi,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void { this.buscar(); }

  buscar(): void {
    this.cargando = true;
    this.api.listarDocumentos(this.filtro).subscribe({
      next: docs => { this.documentos = docs; this.cargando = false; this.cd.markForCheck(); },
      error: () => { this.cargando = false; this.cd.markForCheck(); },
    });
  }

  limpiar(): void {
    this.filtro = { q: '', estado: 'todos', destino: '', fecha: '' };
    this.buscar();
  }

  abrir(doc: DocumentoTransito): void {
    this.api.obtenerDetalle(doc.id).subscribe(d => {
      this.detalle = d;
      this.cd.markForCheck();
    });
  }

  confirmar(req: ConfirmacionRequest): void {
    this.api.confirmar(req).subscribe(res => {
      // TODO: sustituir por el servicio de notificaciones del proyecto.
      console.info('Confirmación generada', res);
      this.detalle = null;
      this.buscar();
    });
  }

  chipEstado(d: DocumentoTransito): { clase: string; texto: string } {
    if (d.estado === 'parcial') {
      return { clase: 'chip-amber', texto: `Parcial · ${d.confirmados}/${d.itemsSerializados}` };
    }
    if (d.estado === 'confirmado') return { clase: 'chip-green', texto: 'Confirmado' };
    return { clase: 'chip-grey', texto: 'Por recibir' };
  }

  trackDoc = (_: number, d: DocumentoTransito) => d.id;
}
