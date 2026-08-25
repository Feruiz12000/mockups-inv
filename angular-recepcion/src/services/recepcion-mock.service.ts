import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { RecepcionApi } from './recepcion.service';
import {
  ConfirmacionRequest, ConfirmacionResponse, DetalleRecepcion,
  DocumentoTransito, FiltroDocumentos, UnidadSerializada,
} from '../models/recepcion.models';

/** Datos de demo equivalentes al mockup. Útil hasta que el back esté listo. */
@Injectable({ providedIn: 'root' })
export class RecepcionMockService implements RecepcionApi {

  private documentos: DocumentoTransito[] = [
    { id: '351-0044213', origen: 'Main WH · WH-PAN-01', destino: 'CONT-44 · Contrata 44', lineas: 6, itemsSerializados: 98, confirmados: 45, itemsNoSerializados: 2, refurbished: false, valor: 3931, fechaEnvio: '2025-08-03', estado: 'parcial' },
    { id: '351-0044198', origen: 'Main WH · WH-PAN-01', destino: 'CONT-44 · Contrata 44', lineas: 3, itemsSerializados: null, confirmados: 0, itemsNoSerializados: 3, refurbished: false, valor: 1240, fechaEnvio: '2025-08-03', estado: 'por-recibir' },
    { id: '351-0044180', origen: 'Main WH · WH-PAN-01', destino: 'CONT-12 · Contrata 12', lineas: 2, itemsSerializados: 12, confirmados: 0, itemsNoSerializados: null, refurbished: true, valor: 980, fechaEnvio: '2025-08-02', estado: 'por-recibir' },
    { id: '351-0044150', origen: 'Main WH · WH-PAN-01', destino: 'CONT-44 · Contrata 44', lineas: 4, itemsSerializados: 24, confirmados: 0, itemsNoSerializados: 1, refurbished: false, valor: 1860, fechaEnvio: '2025-08-02', estado: 'por-recibir' },
    { id: '351-0044131', origen: 'Main WH · WH-PAN-01', destino: 'CONT-08 · Tercero CP-08', lineas: 1, itemsSerializados: 6, confirmados: 0, itemsNoSerializados: null, refurbished: false, valor: 420, fechaEnvio: '2025-08-01', estado: 'por-recibir' },
  ];

  listarDocumentos(filtro: FiltroDocumentos): Observable<DocumentoTransito[]> {
    const q = (filtro.q || '').toUpperCase();
    return of(this.documentos.filter(d =>
      (!q || d.id.includes(q) || d.destino.toUpperCase().includes(q)) &&
      (!filtro.estado || filtro.estado === 'todos' || d.estado === filtro.estado) &&
      (!filtro.destino || d.destino === filtro.destino)
    )).pipe(delay(120));
  }

  obtenerDetalle(documentoId: string): Observable<DetalleRecepcion> {
    const documento = this.documentos.find(d => d.id === documentoId) || this.documentos[0];
    return of({
      documento,
      unidades: this.generarUnidades(),
      rechazados: [
        { serial: 'SN-ONT-7412', razon: 'Serial / MAC no incluido en el documento de origen', intentos: 1, hora: '09:14' },
      ],
      noSerializados: [
        { codigo: 'MAT-500012', material: 'Cable drop coaxial', esperado: 1000, uom: 'FT', conversion: '1 ROL ×1 000 FT/ROL', recibido: 800, valor: 120 },
        { codigo: 'MAT-500044', material: 'Conector SC/APC', esperado: 200, uom: 'UND', conversion: 'sin conversión', recibido: 200, valor: 36 },
      ],
      extras: [],
    }).pipe(delay(150));
  }

  confirmar(req: ConfirmacionRequest): Observable<ConfirmacionResponse> {
    return of({
      documento101: '101-0091' + Math.floor(Math.random() * 900 + 100),
      tipo: req.tipo,
      confirmados: req.confirmados.length,
      enReconciliacion: req.discrepancias.length + req.rechazados.length + req.extras.length,
    }).pipe(delay(300));
  }

  /** 98 unidades: 45 confirmadas, 1 con discrepancia, el resto pendientes. */
  private generarUnidades(): UnidadSerializada[] {
    const out: UnidadSerializada[] = [];
    for (let i = 1; i <= 98; i++) {
      const refurb = i > 40 && i <= 52;
      out.push({
        numero: String(i).padStart(3, '0'),
        material: 'FTTH ONT',
        materialCodigo: refurb ? 'MAT-100231-R' : 'MAT-100231',
        tipoId: 'Serial',
        serial: refurb ? `SN-RF-${2160 + i}` : `SN-ONT-${9000 + i}`,
        valor: refurb ? 22 : 48,
        estado: i <= 45 ? 'confirmado' : 'pendiente',
      });
    }
    out.push({
      numero: '099', material: 'Extender', materialCodigo: 'MAT-100238',
      tipoId: 'Serial', serial: 'SN-EXT-4418', valor: 30, estado: 'discrepancia',
      motivo: 'No llegó en el envío: la caja venía sellada pero incompleta',
    });
    return out;
  }
}
