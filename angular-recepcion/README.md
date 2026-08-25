# Módulo Recepción (351 → 101) — paquete Angular

Port del mockup `warehouse-receipt.html` a componentes Angular listos para pegar
en el proyecto de producción. **HU-INV-02 · spec §11.5 · CU-INV-02 · EP-INV-02.**

---

## 1. Supuestos

Escribí el paquete bajo estas premisas. Si alguna no aplica, avísame y lo ajusto:

| | |
|---|---|
| Angular | **15+ con componentes `standalone`**. En 14 o menos hay que envolverlos en un `NgModule` (ver §6). |
| Estilos | **SCSS**. No hay Sass avanzado: es CSS plano, así que renombrar a `.css` también funciona. |
| UI lib | **Ninguna**. Sin Angular Material ni CDK — el overlay de modal va incluido. |
| Formularios | `FormsModule` (`ngModel`). Si el proyecto usa Reactive Forms, el cambio es mecánico. |
| HTTP | `HttpClient` detrás de una interfaz, con implementación **mock** incluida. |
| Iconos | **Material Icons** por fuente (ligadura de texto). |

## 2. Contenido

```
src/
  models/recepcion.models.ts             tipos del dominio
  services/recepcion.service.ts          interfaz RecepcionApi + impl HttpClient
  services/recepcion-mock.service.ts     datos de demo (98 unidades, etc.)
  shared/help-tooltip.component.ts       el "?" con burbuja
  shared/modal-shell.component.ts        overlay de modal sin dependencias
  recepcion/
    recepcion-page.component.ts|.html    lista de documentos 351
    confirmar-recepcion.component.*      la ventana grande (escaneo + discrepancias)
    dialogs/motivo-dialog.component.*        motivo / comentario de discrepancia
    dialogs/material-extra-dialog.component.* material no incluido
    dialogs/escanear-linea-dialog.component.* "llegó X en lugar de Y"
  styles/_recepcion.scss                 estilos del módulo (extraídos del design system)
```

## 3. Instalación

**a)** Copia `src/` dentro de tu proyecto, p. ej. en `src/app/modules/recepcion/`.

**b)** Importa los estilos una sola vez, en `styles.scss`:

```scss
@import 'app/modules/recepcion/styles/recepcion';
```

> El archivo trae un bloque `:root` con los tokens de marca (`--primary`, `--border`,
> `--text`…). Si tu proyecto ya define los suyos, **borra ese bloque** y mapea las
> variables a las tuyas: el resto del CSS solo consume `var(--…)`.

**c)** Fuentes e iconos en `index.html`:

```html
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

**d)** Provee la API. En `app.config.ts` (o el `providers` de tu módulo):

```ts
import { RECEPCION_API, RecepcionHttpService } from './modules/recepcion/services/recepcion.service';
import { RecepcionMockService } from './modules/recepcion/services/recepcion-mock.service';

providers: [
  provideHttpClient(),
  // producción:
  { provide: RECEPCION_API, useExisting: RecepcionHttpService },
  // mientras el back no esté: { provide: RECEPCION_API, useExisting: RecepcionMockService },
]
```

**e)** Ruta:

```ts
{
  path: 'inventario/recepcion',
  loadComponent: () => import('./modules/recepcion/recepcion/recepcion-page.component')
    .then(m => m.RecepcionPageComponent),
}
```

## 4. Contrato con el backend Node

`RecepcionHttpService` apunta a `/api/recepcion`. Ajusta `base` o inyecta
`RECEPCION_BASE_URL`.

### `GET /documentos`
Query: `q`, `estado` (`por-recibir|parcial|confirmado`), `destino`, `fecha`.
Devuelve `DocumentoTransito[]`.

### `GET /documentos/:id`
Devuelve `DetalleRecepcion`: documento + `unidades[]` + `rechazados[]` +
`noSerializados[]` + `extras[]`.

> El `factor de conversión` (RF 1.2.4) se resuelve **en el back**: el front recibe
> `esperado` ya en UOM operativa (FT/MT) y un texto informativo en `conversion`.

### `POST /documentos/:id/confirmar`
Body `ConfirmacionRequest`, respuesta `ConfirmacionResponse`.

```jsonc
{
  "documentoId": "351-0044213",
  "tipo": "Parcial",
  "confirmados": ["SN-ONT-9001", "..."],
  "discrepancias": [{ "serial": "SN-EXT-4418", "motivo": "No llegó en el envío" }],
  "rechazados":   [{ "serial": "SN-XX-0001", "razon": "...", "comentario": "...", "intentos": 2 }],
  "noSerializados": [{ "codigo": "MAT-500012", "recibido": 800, "uom": "FT" }],
  "extras":       [{ "material": "Cinta aislante", "cantidad": 5, "uom": "UND", "comentario": "Llegó de más" }]
}
```

### ⚠️ Validaciones que el back **debe** repetir

El front bloquea la UI, pero eso no es seguridad. En Node hay que revalidar:

1. **§14.1** — rechazar cualquier `confirmados[]` cuyo serial no pertenezca al 351.
   Un cliente manipulado podría enviarlo.
2. **Cantidad excedida** — `recibido > esperado` en `noSerializados` debe devolver
   error, no recortarse en silencio.
3. **Motivo obligatorio** — toda entrada de `discrepancias[]` con `motivo` vacío
   es inválida.
4. **`extras[]` nunca suma stock.** Va a la cola de reconciliación (§11.5.6), jamás
   al inventario del contratista.
5. **Idempotencia** — el 101 debería generarse una sola vez por documento; usa una
   clave de idempotencia o un estado en la tabla del 351.

## 5. Reglas de negocio implementadas en el front

| Regla | Dónde |
|---|---|
| Un serial que no está en el 351 se rechaza y se muestra como **una discrepancia más** | `escanear()` |
| Un serial ya confirmado no cuenta doble | `escanear()` → toast «Duplicado omitido» |
| Toda discrepancia **exige motivo escrito** (botón deshabilitado si está vacío) | `MotivoDialogComponent` |
| «Llegó X en lugar de Y»: **ninguna de las dos se recibe** | `resolverLinea()` |
| Revertir una discrepancia deshace también el par rechazado | `marcar()` |
| Cantidad por encima de lo esperado **bloquea** el 101 | `puedeConfirmar` |
| El tipo Parcial/Total **se infiere**, no se elige | `tipoConfirmacion` |
| Material no incluido = evidencia, nunca recibido | `extras[]` |

## 6. Notas de portabilidad

- **Angular 14 o menor**: quita `standalone: true` y declara todo en un `NgModule`
  con `CommonModule` y `FormsModule` en `imports`.
- **Angular 17+**: puedes migrar los `*ngIf` / `*ngFor` al control flow nuevo
  (`@if` / `@for`) con `ng generate @angular/core:control-flow`.
- **Si ya tienes servicio de diálogos** (Material, PrimeNG, propio): descarta
  `ModalShellComponent` y monta los cuerpos de `motivo-dialog`,
  `material-extra-dialog` y `escanear-linea-dialog` dentro del tuyo. La lógica no
  depende del overlay.
- **`ChangeDetectionStrategy`**: `confirmar-recepcion` usa `Default` a propósito —
  muta objetos de las listas al escanear. Si lo pasas a `OnPush`, hay que llamar
  `markForCheck()` en `refrescar()` o migrar a signals.
- **Cámara**: el recuadro es un *placeholder*. Para escaneo real, engancha
  `getUserMedia` + `BarcodeDetector` (o `zxing-js`) al botón del ícono del escáner
  y alimenta `codigo` + `escanear()`.

## 7. Lo que NO viene

- Paneles **Confirmados (101)** y **Discrepancias** de la pantalla principal: en el
  mockup eran tablas estáticas. Quedaron como marcador con el endpoint sugerido.
- Exportar, permisos/roles, i18n y notificaciones: usan la infraestructura que ya
  tenga el proyecto.
- Tests. Si quieres, preparo specs de `escanear()`, `resolverLinea()` y
  `tipoConfirmacion`, que es donde está la lógica que puede romperse.
