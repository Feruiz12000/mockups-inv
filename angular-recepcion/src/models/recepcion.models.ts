/**
 * Modelos del módulo de Recepción de inventario en tránsito (351 -> 101).
 * HU-INV-02 · spec §11.5 · CU-INV-02 · EP-INV-02
 */

export type EstadoUnidad = 'pendiente' | 'confirmado' | 'discrepancia';
export type EstadoDocumento = 'por-recibir' | 'parcial' | 'confirmado';

/** Fila de la lista principal: un documento 351 en tránsito. */
export interface DocumentoTransito {
  id: string;                     // 351-0044213
  origen: string;                 // Main WH · WH-PAN-01
  destino: string;                // CONT-44 · Contrata 44
  lineas: number;
  itemsSerializados: number | null;
  confirmados: number;
  itemsNoSerializados: number | null;
  refurbished: boolean;           // muestra el sufijo -R (RF 1.2.5)
  valor: number;
  fechaEnvio: string;             // ISO
  estado: EstadoDocumento;
}

/** Unidad serializada que SÍ pertenece al documento. */
export interface UnidadSerializada {
  numero: string;                 // 001
  material: string;
  materialCodigo: string;
  tipoId: 'Serial' | 'MAC';
  serial: string;
  valor: number;
  estado: EstadoUnidad;
  /** Llegó físicamente pero con daño/novedad (venía confirmada y se revirtió). */
  novedad?: boolean;
  /** Llegó otra unidad en su lugar; guarda el serial recibido. */
  recibido?: string;
  /** Motivo de la discrepancia, capturado en el diálogo. */
  motivo?: string;
}

/**
 * Serial/MAC escaneado que NO pertenece al documento 351.
 * Regla §14.1: no se puede confirmar. Se conserva como evidencia y cuenta
 * como una discrepancia más.
 */
export interface SerialRechazado {
  serial: string;
  /** Razón del rechazo que determina el sistema. */
  razon: string;
  /** Observación libre que escribe el operador. */
  comentario?: string;
  intentos: number;
  hora: string;                   // HH:mm
  /** Si llegó en lugar de una unidad esperada, el serial de aquella. */
  vinculadoA?: string;
}

/** Material no serializado incluido en el documento. */
export interface MaterialNoSerializado {
  codigo: string;
  material: string;
  esperado: number;
  uom: string;                    // UOM operativa: FT, MT, UND...
  /** Texto informativo de conversión, p. ej. "1 ROL ×1 000 FT/ROL" (RF 1.2.4). */
  conversion?: string;
  recibido: number | null;
  valor: number;
}

/** Material que llegó físicamente y NO está en el documento (§14.1). */
export interface MaterialExtra {
  id: string;                     // uuid local hasta que el back lo persista
  material: string;
  cantidad: number;
  uom: string;
  comentario?: string;
}

/** Todo lo que necesita la ventana "Confirmar recepción". */
export interface DetalleRecepcion {
  documento: DocumentoTransito;
  unidades: UnidadSerializada[];
  rechazados: SerialRechazado[];
  noSerializados: MaterialNoSerializado[];
  extras: MaterialExtra[];
}

/** Filtros de la lista principal. */
export interface FiltroDocumentos {
  q?: string;
  estado?: EstadoDocumento | 'todos';
  destino?: string;
  fecha?: string;                 // ISO yyyy-MM-dd
}

/** Payload que se envía al generar la confirmación 101. */
export interface ConfirmacionRequest {
  documentoId: string;
  tipo: 'Parcial' | 'Total';
  confirmados: string[];
  discrepancias: Array<{ serial: string; motivo: string; recibido?: string }>;
  rechazados: Array<{ serial: string; razon: string; comentario?: string; intentos: number }>;
  noSerializados: Array<{ codigo: string; recibido: number; uom: string }>;
  extras: Array<{ material: string; cantidad: number; uom: string; comentario?: string }>;
}

export interface ConfirmacionResponse {
  documento101: string;
  tipo: 'Parcial' | 'Total';
  confirmados: number;
  enReconciliacion: number;
}

/** Resultado de evaluar un escaneo contra el documento. */
export type ResultadoEscaneo =
  | { tipo: 'confirmado'; serial: string }
  | { tipo: 'duplicado'; serial: string }
  | { tipo: 'fuera'; serial: string };
