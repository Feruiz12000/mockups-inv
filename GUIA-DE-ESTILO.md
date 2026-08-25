# Guía de estilo — Inventarios Más Tech

Sistema de diseño único para todas las vistas del proyecto. Basado en la marca real de **web-mastech** (la misma que ves en CWP: botones coral, tarjetas blancas redondeadas, acentos azules en datos, fondo gris claro). Está implementado en [`assets/mastech-webmastech.css`](assets/mastech-webmastech.css) — este documento es la referencia legible de esos mismos tokens.

> Toda vista nueva debe enlazar `assets/mastech-webmastech.css` y usar solo los colores/clases de aquí. No inventar tonos nuevos por vista.

---

## 1. Tipografía

| Uso | Fuente | Ejemplo |
|---|---|---|
| Texto general, UI, tablas, formularios | **DM Sans** (400/500/600/700) | `var(--font)` |
| Títulos, headers de sección, valores KPI | **DM Sans** (700/800), `letter-spacing: -0.02em` | `var(--font-display)` |
| Códigos, seriales, cantidades escaneadas | **JetBrains Mono** (400/500) | `var(--font-mono)` |

Import (van en el `<head>` de cada vista):

```html
<link rel="preconnect" href="https://fonts.gstatic.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
```

Tamaño base de texto: `14px`, `line-height: 1.5`. Títulos de página: `20px / 800`. Títulos de sección/tarjeta: `14px / 700`.

---

## 2. Color

### 2.1 Marca (naranja coral — el del botón "+ Crear Rol")

| Token | Hex | Uso |
|---|---|---|
| `--primary` | `#ff906e` | Botones principales, íconos activos, elementos de foco |
| `--primary-dark` | `#DD7454` | Hover de botón primario, texto sobre tintes claros, links |
| `--primary-light` | `#FDC3AE` | Bordes/decoración suave |
| `--primary-soft` | `#FFE0D2` | Fondos de chip/estado en tono marca |
| `--primary-tint` | `#FFF3EE` | Fondo muy sutil (hover de fila, notas, íconos de header) |

### 2.2 Acento

| Token | Hex | Uso |
|---|---|---|
| `--accent` (azul) | `#077FED` | Links de datos/contadores en tablas (como los números azules "3070", "550"), badges secundarios |
| `--purple` | `#6018E6` | Chip morado (categoría alterna) |
| `--yellow` | `#FEC90F` | Notas/advertencias tipo wireframe |

### 2.3 Semánticos (estado)

| Token | Hex | Uso |
|---|---|---|
| `--success` | `#00C292` | Ícono de check verde (activo/OK), chip verde |
| `--success-dark` | `#067A5C` | Texto sobre chip verde |
| `--warn` | `#FC4B6C` | Error, acción destructiva |
| `--amber` | `#B36B00` | Advertencia (texto sobre chip ámbar) |
| `--info` | `#1856E6` | Información |

### 2.4 Neutros

| Token | Hex | Uso |
|---|---|---|
| `--text` | `#1A1A1A` | Texto principal (títulos, nombres) |
| `--text-2` | `#35383F` | Texto de celdas de tabla |
| `--text-secondary` | `#6B7280` | Descripciones, labels, subtítulos |
| `--text-hint` | `#97A1B3` | Placeholders, texto deshabilitado, íconos inactivos (círculo gris "—") |
| `--border` | `#E2E5EB` | Bordes de tarjetas, inputs, separadores de tabla |
| `--bg` | `#F6F7FA` | Fondo general de la página |
| `--bg-2` | `#EEF0F4` | Fondo de campos readonly, botones secundarios |
| `--card` | `#FFFFFF` | Fondo de tarjetas, sidebar, topbar, inputs |
| `--hover` | `rgba(251,151,120,.10)` | Fondo hover genérico (fila, ítem de menú) |

**Regla de contraste:** texto sobre `--primary` siempre blanco. Texto sobre tintes (`*-tint`, `*-soft`) siempre la variante `-dark` del mismo color, nunca el color base.

---

## 3. Forma y elevación

| Token | Valor | Uso |
|---|---|---|
| `--radius` | `20px` | Tarjetas grandes, modal, KPI tiles (mismo radio que las `mat-card` reales) |
| `--radius-sm` | `12px` | Inputs, tarjetas chicas |
| `--radius-lg` | `20px` | Modales |
| `--pill` | `999px` | Botones, chips, campos de búsqueda, avatares |
| `--shadow-1` | `0 1px 2px rgba(20,25,40,.04), 1px 0 20px rgba(20,25,40,.08)` | Tarjetas, KPI, campos |
| `--shadow-2` | `0 16px 40px -8px rgba(20,25,40,.22)` | Modales, popovers |

Esquinas siempre redondeadas — nada de esquinas vivas en tarjetas, botones o inputs.

---

## 4. Iconografía

- Librería única: **Material Icons** (ligature font, `<span class="material-icons">nombre_icono</span>`).
- No mezclar con otras librerías de íconos (Font Awesome, Lucide, etc.) para mantener el mismo trazo visual.
- Tamaños estándar: `16px` (inline en texto/breadcrumb), `18–20px` (dentro de botones, filtros, nav), `26px` (header de página, KPI icon), `44px` (empty state).
- Color de ícono sigue al contexto: gris (`--text-hint`/`--text-secondary`) por defecto, `--primary` cuando el ítem está activo o es la acción principal.
- Patrón "icon tile": ícono dentro de un cuadrado `48x48` con `border-radius: 14px` y fondo `--primary-tint` + color `--primary` (ver `.mt-header-icon`, `.mt-kpi .k-icon`). Úsalo para destacar el ícono de cabecera de cada módulo.
- Estados tipo toggle (como el check verde / guion gris de la captura): círculo relleno `--success` con ✓ blanco para "activo", círculo outline `--text-hint` con "—" para "inactivo". No usar rojo para el estado inactivo, solo para error real.

---

## 5. Componentes clave

Todas estas clases ya existen en `assets/mastech-webmastech.css` — reusarlas, no reescribir CSS por vista.

| Componente | Clase | Notas |
|---|---|---|
| Botón primario | `.mt-btn.mt-btn-primary` | Fondo `--primary`, sombra coral suave, hover `--primary-dark` |
| Botón secundario/plano | `.mt-btn` / `.mt-btn-stroked` / `.mt-btn-plain` | Para acciones no destacadas |
| Botón de acento | `.mt-btn-accent` | Azul, para acciones secundarias importantes |
| Ícono clicable | `.mt-icon-btn` | Circular, 34px, hover con `--hover` |
| Tarjeta | `.mt-card` | Contenedor base de toda sección |
| Header de página | `.mt-page-header` + `.mt-header-icon` | Ícono + título + subtítulo |
| Campo de filtro/búsqueda | `.mt-field` | Pill, ícono a la izquierda |
| Input/select/textarea | `.mt-input` / `.mt-select` / `.mt-textarea` | Focus con anillo `--primary-soft` |
| Tabla | `table.mt-table` | Encabezado uppercase gris, hover de fila en `--primary-tint` |
| Chip / estado | `.mt-chip.chip-*` | ver tabla de significados en la sección 5.1 |
| KPI tile | `.mt-kpi` | Ícono + valor grande + label + delta (verde/rojo) |
| Modal | `.mt-modal-overlay` / `.mt-modal` | Overlay oscuro 50%, modal blanco con `--radius-lg` |
| Alertas inline | `.mt-alert.warn/.err/.ok` | Fondo tinte + ícono a la izquierda |
| Tabs | `.mt-tabs` / `.mt-tab.active` | Subrayado `--primary` en el tab activo |
| Timeline | `.mt-timeline` | Puntos: gris (pendiente), verde (hecho), naranja con halo (actual) |

### 5.1 Significado de cada color de chip

Cada color de `.mt-chip` representa **una sola dimensión** de información — nunca mezclar un color entre dimensiones distintas, aunque parezca que "sobra" un color bonito para otra cosa. Esto es lo que hace que, con solo mirar el color, sepas de qué tipo de dato se trata antes de leer el texto.

| Color | Dimensión | Significa | Ejemplos |
|---|---|---|---|
| **Verde** (`chip-green`) | Estado — positivo/completo | La operación terminó bien o el ítem está en su condición "buena" | Disponible, Deployable, Confirmado, Activo, Aprobado, Devuelto, Collected |
| **Rojo** (`chip-red`) | Estado — negativo/bloqueado | Error, bloqueo o algo que no se puede usar | No disponible, Undeployable, Error, Vencido, Descartado, Quiebre |
| **Ámbar** (`chip-amber`) | Estado — en curso / requiere atención | Todavía no termina, o necesita que alguien revise algo | En prueba, Parcial, Restringida, in transit, Para reconciliación, Planificado |
| **Gris** (`chip-grey`) | Estado — neutro / en espera | Nada urgente, simplemente no ha empezado o no aplica | Pendiente, Inactivo, Por recibir, N/A, Cerrado |
| **Azul** (`chip-blue`) | Estado — paso intermedio de un flujo conocido | Ya avanzó al siguiente paso de una secuencia, pero aún no es el final | Pendiente de prueba, por recibir → **received**, préstamo Activo |
| **Índigo** (`chip-indigo`) | Clasificación — fase / categoría / propietario | Una etiqueta descriptiva, no un estado — identifica de **quién** es o a **qué grupo** pertenece | Fase 1/2/3, Técnico · T-2291, Tienda · Vía España, Tercero · CP-08, Sublocación |
| **Teal** (`chip-teal`) | Clasificación — módulo del sistema | Qué módulo de la app generó este registro (típico en auditoría/logs) | Recepción, Asignación, Consumo, Collection, Retorno, Testing, Catálogos |
| **Morado** (`chip-purple`) | Clasificación — condición de reacondicionamiento | Marca que el ítem viene de un flujo de recuperación/reparación | Recuperado -R, Repair / TR, Reacondicionado |
| **Sky** (`chip-sky`) / **Slate** (`chip-slate`) | Clasificación — tipo de material | Si el ítem se rastrea por serial individual o por cantidad a granel | Serializado (sky) / No serializado (slate) |

**Regla al agregar un chip nuevo:** primero identifica a cuál de estas 9 dimensiones pertenece el dato, y usa el color de esa dimensión — no elijas "el que se vea bonito". Si de verdad es un concepto nuevo que no encaja en ninguna, avisa antes de inventar un color suelto.

---

## 6. Estado de migración

Todas las vistas de `mockups/*.html` enlazan ya `assets/mastech-webmastech.css` y la fuente DM Sans — no queda ninguna en la paleta anterior "+móvil". `assets/mastech.css` se deja en el repo solo como referencia histórica; no se debe enlazar desde ninguna vista nueva.

Toda vista **nueva** debe partir de este mismo `<head>`:

```html
<link rel="preconnect" href="https://fonts.gstatic.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<link rel="stylesheet" href="assets/mastech-webmastech.css">
```

Y usar siempre `var(--token)` para color (nunca un hex suelto) — así cualquier ajuste futuro de paleta se propaga a todas las vistas desde un solo lugar.
