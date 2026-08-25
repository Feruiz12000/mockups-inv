import { Injectable, InjectionToken } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ConfirmacionRequest, ConfirmacionResponse, DetalleRecepcion,
  DocumentoTransito, FiltroDocumentos,
} from '../models/recepcion.models';

/**
 * Contrato con el backend Node. El componente depende de esta interfaz, no de
 * HttpClient, para que puedas enchufar el mock en desarrollo y tests.
 */
export interface RecepcionApi {
  listarDocumentos(filtro: FiltroDocumentos): Observable<DocumentoTransito[]>;
  obtenerDetalle(documentoId: string): Observable<DetalleRecepcion>;
  confirmar(req: ConfirmacionRequest): Observable<ConfirmacionResponse>;
}

export const RECEPCION_API = new InjectionToken<RecepcionApi>('RECEPCION_API');

/** Ajusta la base a la ruta real de tu API Node. */
export const RECEPCION_BASE_URL = new InjectionToken<string>('RECEPCION_BASE_URL', {
  providedIn: 'root',
  factory: () => '/api/recepcion',
});

@Injectable({ providedIn: 'root' })
export class RecepcionHttpService implements RecepcionApi {
  constructor(private http: HttpClient) {}

  private base = '/api/recepcion';

  listarDocumentos(filtro: FiltroDocumentos): Observable<DocumentoTransito[]> {
    let params = new HttpParams();
    if (filtro.q) params = params.set('q', filtro.q);
    if (filtro.estado && filtro.estado !== 'todos') params = params.set('estado', filtro.estado);
    if (filtro.destino) params = params.set('destino', filtro.destino);
    if (filtro.fecha) params = params.set('fecha', filtro.fecha);
    return this.http.get<DocumentoTransito[]>(`${this.base}/documentos`, { params });
  }

  obtenerDetalle(documentoId: string): Observable<DetalleRecepcion> {
    return this.http.get<DetalleRecepcion>(`${this.base}/documentos/${documentoId}`);
  }

  confirmar(req: ConfirmacionRequest): Observable<ConfirmacionResponse> {
    return this.http.post<ConfirmacionResponse>(
      `${this.base}/documentos/${req.documentoId}/confirmar`, req);
  }
}
