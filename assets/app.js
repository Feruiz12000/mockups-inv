/* ==========================================================================
   Más Tech · Inventario — Shell de mockups (sidebar con logo + barra superior)
   Estructura alineada a web-mastech: sidebar blanco a la izquierda con el logo
   arriba, y una barra superior blanca minimal (hamburguesa + usuario) sobre el
   área de contenido. Colores/tipografías de marca +móvil. Sin lógica de negocio.
   Cada página define en <body> sus data-*: module, title, subtitle, breadcrumb.
   El contenido real de la pantalla va dentro de <div id="mt-page"> ... </div>.
   ========================================================================== */
(function () {
  "use strict";

  var SPARKLE = '<svg viewBox="0 0 100 100" aria-hidden="true"><path fill="currentColor" d="M50 4 C56 36,64 44,96 50 C64 56,56 64,50 96 C44 64,36 56,4 50 C36 44,44 36,50 4 Z"/></svg>';

  // --- Definición de navegación (un ítem por mockup de módulo) ---
  var NAV = [
    { group: null, items: [
      { id: "dashboard", label: "Dashboard", icon: "dashboard", href: "dashboard.html" }
    ]},
    { group: "Operación", items: [
      { id: "warehouse-receipt",   label: "Recepción",            icon: "move_to_inbox",     href: "warehouse-receipt.html" },
      { id: "assignment",          label: "Asignación",           icon: "assignment_ind",    href: "assignment.html" },
      { id: "confirmacion-tecnico",label: "Confirmación Técnico",  icon: "how_to_reg",        href: "confirmacion-tecnico.html" },
      { id: "consumption",         label: "Consumo",              icon: "build",             href: "consumption.html" },
      { id: "consolidation-booking",label:"Consolidación / Booking",icon:"request_quote",     href: "consolidation-booking.html" }
    ]},
    { group: "Collection y retorno", items: [
      { id: "collection", label: "Collection", icon: "assignment_returned", href: "collection.html" },
      { id: "return",     label: "Retorno a bodega", icon: "local_shipping", href: "return.html" }
    ]},
    { group: "Equipos recuperados", items: [
      { id: "testing",       label: "Testing",       icon: "science",  href: "testing.html" },
      { id: "refurbishment", label: "Refurbishment", icon: "autorenew",href: "refurbishment.html" },
      { id: "loan",          label: "Préstamos",     icon: "swap_horiz",href: "loan.html" }
    ]},
    { group: "Proyectos", items: [
      { id: "project-usage", label: "Proyectos de expansión", icon: "account_tree", href: "project-usage.html" }
    ]},
    { group: "Consultas", items: [
      { id: "consulta-stock", label: "Consulta de stock",  icon: "inventory_2", href: "consulta-stock.html" },
      { id: "reporting",      label: "Reportes / Dashboards", icon: "bar_chart", href: "reporting.html" },
      { id: "auditoria",      label: "Auditoría",          icon: "fact_check",  href: "auditoria.html" }
    ]},
    { group: "Administración", items: [
      { id: "catalogos",      label: "Catálogos",      icon: "category", href: "catalogos.html" },
      { id: "administracion", label: "Administración", icon: "settings", href: "administracion.html" }
    ]}
  ];

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function icon(name) { return '<span class="material-icons">' + name + "</span>"; }

  document.addEventListener("DOMContentLoaded", function () {
    var d = document.body.dataset;
    var moduleId = d.module || "";
    var title = d.title || document.title;
    var breadcrumb = d.breadcrumb || title;

    var shell = el("div", "mt-shell");
    try {
      if (localStorage.getItem("mt-sidebar-collapsed") === "1") shell.classList.add("mt-sidebar-collapsed");
    } catch (e) {}

    // ---- Sidebar (logo arriba + navegación) ----
    var sidebar = el("aside", "mt-sidebar");
    var logo = el("div", "mt-sidebar-logo");
    logo.innerHTML = '<a href="index.html">' +
        '<span class="mt-logo">' + SPARKLE + "</span>" +
        '<span class="mt-logo-text"><b>Más Tech</b><small>Inventario</small></span>' +
      "</a>";
    sidebar.appendChild(logo);
    NAV.forEach(function (grp) {
      if (grp.group) sidebar.appendChild(el("div", "mt-nav-group-label", grp.group));
      grp.items.forEach(function (it) {
        var a = el("a", "mt-nav-item" + (it.id === moduleId ? " active" : ""));
        a.href = it.href;
        a.innerHTML = icon(it.icon) + "<span>" + it.label + "</span>";
        sidebar.appendChild(a);
      });
    });

    // ---- Área principal: barra superior blanca + contenido ----
    var mainWrap = el("div", "mt-main-wrap");
    var topbar = el("header", "mt-topbar");
    topbar.innerHTML =
      '<button class="mt-hamburger" id="mt-ham" title="Menú">' + icon("menu") + "</button>" +
      '<span class="mt-spacer"></span>' +
      '<button class="mt-top-action" title="Alarmas de inventario" style="position:relative">' + icon("notifications") +
        '<span class="mt-dot"></span></button>' +
      '<button class="mt-top-action" title="Configuración">' + icon("settings") + "</button>" +
      '<div class="mt-user"><span>Usuario Mastech</span><span class="mt-avatar">MT</span></div>';

    var main = el("section", "mt-main");
    var bc = el("div", "mt-breadcrumb");
    bc.innerHTML = '<a href="index.html">Inventario</a>' + icon("chevron_right") +
      breadcrumb.split("·").map(function (p, i, arr) {
        p = p.trim();
        return i === arr.length - 1 ? "<b>" + p + "</b>" : p;
      }).join(' <span class="material-icons">chevron_right</span> ');
    main.appendChild(bc);

    var note = el("div", "mt-wire-note");
    note.innerHTML = icon("info") + "<span>Mockup / wireframe — solo interfaz y flujo visual, sin lógica de negocio. Datos de ejemplo.</span>";
    main.appendChild(note);

    var page = document.getElementById("mt-page");
    if (page) { page.parentNode.removeChild(page); main.appendChild(page); }

    mainWrap.appendChild(topbar);
    mainWrap.appendChild(main);

    shell.appendChild(sidebar);
    shell.appendChild(mainWrap);
    document.body.insertBefore(shell, document.body.firstChild);

    var ham = document.getElementById("mt-ham");
    if (ham) ham.addEventListener("click", function () {
      if (window.matchMedia("(max-width: 960px)").matches) {
        shell.classList.toggle("nav-open");
        return;
      }
      var collapsed = shell.classList.toggle("mt-sidebar-collapsed");
      try { localStorage.setItem("mt-sidebar-collapsed", collapsed ? "1" : "0"); } catch (e) {}
    });

    document.querySelectorAll("[data-select-scope]").forEach(refreshScope);
    document.querySelectorAll("input[data-expected]").forEach(function (i) { qtyCheck(i); });
    document.querySelectorAll("select[data-toggle]").forEach(applyToggle);
    document.querySelectorAll("[data-scan-scope]").forEach(scanRefresh);

    document.title = "Más Tech · Inventario · " + (title.split("·")[0].trim());
  });

  // --- Helpers genéricos (delegación de eventos) ---
  document.addEventListener("click", function (ev) {
    var t = ev.target.closest("[data-open-modal]");
    if (t) {
      ev.preventDefault();
      var m = document.getElementById(t.getAttribute("data-open-modal"));
      if (m) m.classList.add("open");
      return;
    }
    if (ev.target.closest("[data-close-modal]")) {
      var ov = ev.target.closest(".mt-modal-overlay");
      if (ov) ov.classList.remove("open");
      return;
    }
    if (ev.target.classList && ev.target.classList.contains("mt-modal-overlay")) {
      ev.target.classList.remove("open");
      return;
    }
    var tab = ev.target.closest("[data-tab]");
    if (tab) {
      var key = tab.getAttribute("data-tab");
      var scope = tab.closest("[data-tabs]") || document;
      scope.querySelectorAll("[data-tab]").forEach(function (x) { x.classList.toggle("active", x === tab); });
      scope.querySelectorAll("[data-tabpanel]").forEach(function (p) {
        p.style.display = p.getAttribute("data-tabpanel") === key ? "" : "none";
      });
    }
  });

  // --- Selección de filas (genérico). Marca un contenedor con [data-select-scope];
  //     las casillas .chk-row (y opcional .chk-all) y el botón [data-bulk-btn] que
  //     lleva data-bulk-label + un <span class="lbl"> se sincronizan solos. ---
  function refreshScope(scope) {
    if (!scope) return;
    // Las filas deshabilitadas (p. ej. stock no disponible) no cuentan: si no
    // se excluyen, "seleccionar todo" nunca llega a marcarse del todo y el
    // siguiente clic vuelve a seleccionar en vez de limpiar.
    var rows = [].filter.call(scope.querySelectorAll(".chk-row"), function (c) { return !c.disabled; });
    var checked = 0;
    rows.forEach(function (c) { if (c.checked) checked++; });
    var all = scope.querySelector(".chk-all");
    if (all) {
      all.checked = rows.length > 0 && checked === rows.length;
      all.indeterminate = checked > 0 && checked < rows.length;
      all.disabled = rows.length === 0;
    }
    [].forEach.call(scope.querySelectorAll("[data-bulk-btn]"), function (btn) {
      var base = btn.getAttribute("data-bulk-label") || "";
      var lbl = btn.querySelector(".lbl");
      btn.disabled = checked === 0;
      if (lbl) lbl.textContent = checked ? (base + " (" + checked + ")") : base;
    });
  }
  document.addEventListener("change", function (e) {
    var scope = e.target.closest && e.target.closest("[data-select-scope]");
    if (!scope) return;
    if (e.target.classList && e.target.classList.contains("chk-all")) {
      [].forEach.call(scope.querySelectorAll(".chk-row"), function (c) { if (!c.disabled) c.checked = e.target.checked; });
    }
    if (e.target.classList && (e.target.classList.contains("chk-all") || e.target.classList.contains("chk-row"))) refreshScope(scope);
  });

  // --- Chip de contexto individual/lote (opcional). El botón en lote lleva
  //     data-bulk-mode="… {n} …"; la acción de fila lleva data-row-mode="… {id}".
  //     Ambos actualizan el elemento [data-select-mode] con su data-mode-class. ---
  document.addEventListener("click", function (e) {
    var bulk = e.target.closest && e.target.closest("[data-bulk-btn]");
    if (bulk && !bulk.disabled && bulk.getAttribute("data-bulk-mode")) {
      var modeEl = document.querySelector("[data-select-mode]");
      var scope = bulk.closest("[data-select-scope]");
      if (modeEl && scope) {
        var cnt = 0;
        [].forEach.call(scope.querySelectorAll(".chk-row"), function (c) { if (c.checked) cnt++; });
        modeEl.textContent = bulk.getAttribute("data-bulk-mode").replace("{n}", cnt);
        if (bulk.getAttribute("data-mode-class")) modeEl.className = bulk.getAttribute("data-mode-class");
      }
      return;
    }
    var rowm = e.target.closest && e.target.closest("[data-row-mode]");
    if (rowm) {
      var modeEl2 = document.querySelector("[data-select-mode]");
      if (modeEl2) {
        var tr = rowm.closest("tr");
        var idc = tr && tr.querySelector("td.cell-mono");
        modeEl2.textContent = rowm.getAttribute("data-row-mode").replace("{id}", idc ? idc.textContent : "");
        if (rowm.getAttribute("data-mode-class")) modeEl2.className = rowm.getAttribute("data-mode-class");
      }
    }
  });

  // --- Validación de cantidad vs esperada (materiales no serializados). Un input
  //     con data-expected (+opcional data-uom) actualiza el [data-qty-status] de su
  //     fila: Completa (igual) / Faltante (menor) / Excede-no permitido (mayor), y
  //     deshabilita el [data-confirm-btn] cuando excede lo asignado. ---
  function qtyCheck(inp) {
    var exp = parseFloat(inp.getAttribute("data-expected"));
    var uom = inp.getAttribute("data-uom") || "";
    var mode = inp.getAttribute("data-qty-mode") || "";   // "" = esperado (recepción/confirmación); "max" = tope disponible
    var row = inp.closest("tr") || inp.closest("[data-qty-scope]") || inp.closest(".mt-filter-bar");
    if (!row) return;
    var st = row.querySelector("[data-qty-status]");
    var btn = row.querySelector("[data-confirm-btn]");
    var v = (inp.value || "").trim();
    function set(icon, txt, cls) {
      if (!st) return;
      st.innerHTML = (icon ? '<span class="material-icons">' + icon + "</span> " : "") + txt;
      st.className = "mt-chip " + cls;
      st.style.display = txt ? "" : "none";
    }
    if (v === "" || isNaN(parseFloat(v))) { set("", mode === "max" ? "" : "Pendiente", "chip-grey"); if (btn) btn.disabled = false; return; }
    var n = parseFloat(v), u = uom ? " " + uom : "";
    if (mode === "max") {
      if (n <= exp) { set("check_circle", "Dentro de disponible", "chip-green"); if (btn) btn.disabled = false; }
      else { set("block", "Excede disponible +" + (n - exp) + u + " — no permitido", "chip-red"); if (btn) btn.disabled = true; }
      return;
    }
    if (n === exp) { set("check_circle", "Completa", "chip-green"); if (btn) btn.disabled = false; }
    else if (n < exp) { set("error", "Faltante −" + (exp - n) + u, "chip-amber"); if (btn) btn.disabled = false; }
    else { set("block", "Excede +" + (n - exp) + u + " — no permitido", "chip-red"); if (btn) btn.disabled = true; }
  }
  document.addEventListener("input", function (e) {
    var inp = e.target.closest && e.target.closest("input[data-expected]");
    if (inp) qtyCheck(inp);
  });

  // ======================================================================
  //  Escaneo continuo con auto-match (recepción de documentos 351)
  //  Contenedor [data-scan-scope] con:
  //    - input  [data-scan-input]            campo de escaneo (siempre enfocado)
  //    - filas  tr[data-serial][data-scan-state="pendiente|confirmado|discrepancia"]
  //    - filtros[data-scan-filter="pendientes|confirmados|discrepancia|todos"]
  //    - filas  tr[data-out-serial]  seriales rechazados §14.1 (cuentan como discrepancia)
  //    - buscador [data-scan-search]
  //    - contadores [data-scan-conf] [data-scan-pend] [data-scan-disc]
  //                 [data-scan-fuera] [data-scan-total] [data-scan-pct]
  //    - barra   [data-scan-bar]     · mensaje [data-scan-feedback]
  //  Solo UX de mockup: no hay lógica de negocio detrás.
  // ======================================================================
  function norm(v) { return (v || "").toString().trim().toUpperCase(); }

  function scanRows(scope) { return [].slice.call(scope.querySelectorAll("tr[data-serial]")); }

  function scanOutRows(scope) { return [].slice.call(scope.querySelectorAll("tr[data-out-serial]")); }

  function scanApplyFilter(scope) {
    var f = scope.getAttribute("data-scan-active") || "pendientes";
    var sInput = scope.querySelector("[data-scan-search]");
    var q = norm(sInput && sInput.value);
    var shown = 0;

    // unidades del documento
    scanRows(scope).forEach(function (tr) {
      var st = tr.getAttribute("data-scan-state") || "pendiente";
      var okF = (f === "todos") ||
                (f === "pendientes" && st === "pendiente") ||
                (f === "confirmados" && st === "confirmado") ||
                (f === "discrepancia" && st === "discrepancia");
      var okQ = !q || norm(tr.textContent).indexOf(q) > -1;
      var vis = okF && okQ;
      tr.style.display = vis ? "" : "none";
      if (vis) shown++;
    });

    // seriales rechazados (§14.1): viven en la misma tabla y cuentan como discrepancia
    scanOutRows(scope).forEach(function (tr) {
      var okF = (f === "todos" || f === "discrepancia");
      var okQ = !q || norm(tr.textContent).indexOf(q) > -1;
      var vis = okF && okQ;
      tr.style.display = vis ? "" : "none";
      if (vis) shown++;
    });

    // cada fila de observación sigue la visibilidad de la fila a la que pertenece
    scope.querySelectorAll("tr.mt-nota-row, tr.rcp-motivo-row").forEach(function (nr) {
      var prev = nr.previousElementSibling;
      nr.style.display = (prev && prev.style.display !== "none") ? "" : "none";
    });

    var em = scope.querySelector("[data-scan-empty]");
    if (em) em.style.display = shown ? "none" : "";

    var sc = scope.querySelector("[data-scan-shown]");
    if (sc) sc.textContent = shown;
    var stot = scope.querySelector("[data-scan-shown-total]");
    if (stot) stot.textContent = scanRows(scope).length + scanOutRows(scope).length;
    var slab = scope.querySelector("[data-scan-shown-label]");
    if (slab) slab.textContent = "unidades";
  }

  function scanRefresh(scope) {
    var rows = scanRows(scope), conf = 0, pend = 0, disc = 0;
    rows.forEach(function (tr) {
      var st = tr.getAttribute("data-scan-state") || "pendiente";
      if (st === "confirmado") conf++; else if (st === "discrepancia") disc++; else pend++;
      tr.classList.toggle("u-confirmado", st === "confirmado");
      tr.classList.toggle("u-discrepancia", st === "discrepancia");
      var rec = tr.getAttribute("data-received");   // llegó otra unidad en lugar de la esperada
      var chip = tr.querySelector("[data-scan-chip]");
      if (chip) {
        if (st === "confirmado") { chip.className = "mt-chip chip-green"; chip.innerHTML = '<span class="material-icons">check_circle</span> Confirmado'; chip.title = ""; }
        else if (st === "discrepancia" && rec) {
          chip.className = "mt-chip chip-red";
          chip.innerHTML = '<span class="material-icons">swap_horiz</span> No coincide';
          chip.title = "Se esperaba " + tr.getAttribute("data-serial") + " y llegó " + rec +
                       ". Ninguna de las dos se recibe: la esperada queda faltante y la recibida se rechaza por no pertenecer al documento (§14.1).";
        }
        else if (st === "discrepancia" && tr.getAttribute("data-novedad")) { chip.className = "mt-chip chip-amber"; chip.innerHTML = '<span class="material-icons">report_problem</span> Con novedad'; chip.title = "Llegó con novedad/daño — no se recibe; va a reconciliación (§11.5.6)."; }
        else if (st === "discrepancia") { chip.className = "mt-chip chip-amber"; chip.innerHTML = '<span class="material-icons">error</span> Discrepancia'; chip.title = "No llegó en el envío."; }
        else { chip.className = "mt-chip chip-grey"; chip.textContent = "Pendiente"; chip.title = ""; }
      }
      // nota "→ llegó XXX" bajo el serial esperado
      var sCell = tr.querySelector("td.left.cell-mono");
      if (sCell) {
        var note = sCell.querySelector("[data-recv-note]");
        if (rec && st === "discrepancia") {
          if (!note) {
            note = document.createElement("div");
            note.setAttribute("data-recv-note", "");
            note.className = "small"; note.style.color = "var(--warn)"; note.style.marginTop = "2px";
            sCell.appendChild(note);
          }
          note.innerHTML = "→ llegó <b>" + rec + "</b>";
        } else if (note) { note.parentNode.removeChild(note); }
      }
      // el escaneo por línea solo aplica a unidades pendientes: si ya está
      // confirmada o marcada con discrepancia, primero hay que revertirla
      var lb = tr.querySelector("[data-scan-line]");
      if (lb) {
        lb.style.display = (st === "pendiente") ? "" : "none";
        lb.title = "Escanear serial/MAC";
      }
      // El tooltip y el ícono del botón de acción describen lo que hará SEGÚN el estado actual
      var btn = tr.querySelector("[data-scan-mark]");
      if (btn) {
        var serial = tr.getAttribute("data-serial") || "la unidad";
        var ico = btn.querySelector(".material-icons");
        if (st === "discrepancia") {
          btn.title = "Quitar la discrepancia de " + serial + " y devolverla a Pendiente (queda lista para escanear de nuevo)";
          if (ico) ico.textContent = "undo";
          btn.classList.remove("warn"); btn.classList.add("primary");
        } else if (st === "confirmado") {
          btn.title = "Revertir la confirmación de " + serial + " y registrar una discrepancia indicando el motivo";
          if (ico) ico.textContent = "report_problem";
          btn.classList.remove("primary"); btn.classList.add("warn");
        } else {
          btn.title = "Registrar una discrepancia en " + serial + ": se abrirá una ventana para indicar el motivo";
          if (ico) ico.textContent = "report_problem";
          btn.classList.remove("primary"); btn.classList.add("warn");
        }
      }
    });
    // actualiza TODOS los elementos con ese marcador (el chip del escáner y el contador)
    function put(sel, val) { scope.querySelectorAll(sel).forEach(function (e) { e.textContent = val; }); }
    put("[data-scan-conf]", conf); put("[data-scan-pend]", pend);
    // un serial fuera del documento cuenta como una discrepancia más
    var out = scanOutRows(scope).length;
    put("[data-scan-disc]", disc + out); put("[data-scan-total]", rows.length);
    put("[data-scan-fuera]", out);
    var pct = rows.length ? Math.round(conf * 100 / rows.length) : 0;
    put("[data-scan-pct]", pct + "%");
    var bar = scope.querySelector("[data-scan-bar]");
    if (bar) bar.style.width = pct + "%";
    scanRenderNovedadNotes(scope);
    scanApplyFilter(scope);
  }

  function scanFeedback(scope, kind, html) {
    var fb = scope.querySelector("[data-scan-feedback]");
    if (!fb) return;
    fb.className = "mt-alert " + (kind === "ok" ? "ok" : kind === "warn" ? "warn" : "err");
    fb.innerHTML = html;
    fb.style.display = "";
  }

  // Registra un serial escaneado que NO pertenece al documento origen (§14.1).
  // Si ya estaba en la lista, solo suma un intento.
  function scanAddOut(scope, code, motivo, linkedTo) {
    var body = scope.querySelector("[data-scan-units] tbody");
    if (!body) return;
    var prev = scanOutRows(scope).filter(function (tr) { return norm(tr.getAttribute("data-out-serial")) === code; })[0];
    if (prev) {                                  // ya estaba: solo suma un intento
      prev.setAttribute("data-out-count", (parseInt(prev.getAttribute("data-out-count"), 10) || 1) + 1);
      scanRenderOutMeta(prev);
      return;
    }
    var d = new Date();
    var hora = ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
    var tr = document.createElement("tr");
    tr.className = "u-fuera";
    tr.setAttribute("data-out-serial", code);
    tr.setAttribute("data-out-count", "1");
    tr.setAttribute("data-out-hora", hora);
    if (linkedTo) tr.setAttribute("data-out-linked", linkedTo);
    tr.innerHTML =
      '<td class="cell-mono">—</td>' +
      '<td class="left">No pertenece al documento 351<div class="small muted">' +
        esc(motivo || "Serial / MAC no incluido en el documento de origen") + "</div></td>" +
      "<td>—</td>" +
      '<td class="left cell-mono">' + esc(code) + '<div class="small muted" data-out-meta></div></td>' +
      '<td class="cell-mono">—</td>' +
      '<td><span class="mt-chip chip-amber" title="No pertenece a este documento 351: el sistema lo rechaza y no puede confirmarse (§14.1). Queda como evidencia y va a reconciliación.">' +
        '<span class="material-icons">error</span> Discrepancia</span>' +
        '<div class="u-fuera-sub">Fuera del documento</div></td>' +
      '<td class="row-actions"><button class="mt-icon-btn warn" data-scan-out-remove ' +
      'title="Quitar ' + esc(code) + ' de la lista (por ejemplo, si fue un error de lectura del escáner)">' +
      '<span class="material-icons">delete</span></button></td>';
    body.appendChild(tr);
    scanRenderOutMeta(tr);
  }

  // "×N intentos · hh:mm" bajo el serial rechazado
  function scanRenderOutMeta(tr) {
    var el = tr.querySelector("[data-out-meta]");
    if (!el) return;
    var n = parseInt(tr.getAttribute("data-out-count"), 10) || 1;
    el.textContent = "×" + n + (n === 1 ? " intento" : " intentos") + " · " + (tr.getAttribute("data-out-hora") || "");
  }

  function esc(s) { return (s == null ? "" : String(s)).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

  // ============ Evaluación inmediata + chip transitorio (toast) ============
  // Cada escaneo se resuelve al instante contra el documento: confirma (match),
  // rechaza (fuera del documento §14.1) u omite (duplicado). El resultado se avisa
  // con un chip transitorio que se oculta solo. Los productos se ven en la tabla de
  // unidades; las observaciones viven por unidad, en la vista Con discrepancia.
  function scanToast(scope, kind, code) {
    var el = scope.querySelector("[data-scan-toast]");
    if (!el) return;
    var map = {
      confirmado: { cls: "chip-green", ico: "check_circle",   txt: "Confirmado" },
      novedad:    { cls: "chip-amber", ico: "report_problem", txt: "Con novedad" },
      fuera:      { cls: "chip-red",   ico: "block",          txt: "Fuera del documento" },
      dup:        { cls: "chip-grey",  ico: "content_copy",   txt: "Duplicado omitido" }
    };
    var m = map[kind] || map.dup;
    el.className = "rcp-toast mt-chip " + m.cls + " show";
    el.innerHTML = '<span class="material-icons">' + m.ico + '</span> ' + m.txt + (code ? ' · ' + esc(code) : '');
    clearTimeout(scope.__toastT);
    scope.__toastT = setTimeout(function () { el.classList.remove("show"); }, 2200);
  }

  function scanSubmit(scope, value) {
    var code = norm(value);
    if (!code) return;
    var row = scanRows(scope).filter(function (t) { return norm(t.getAttribute("data-serial")) === code; })[0];

    // Duplicado: ya confirmada → se omite (no cuenta doble)
    if (row && (row.getAttribute("data-scan-state") || "pendiente") === "confirmado") {
      scanToast(scope, "dup", code);
      return;
    }
    // Fuera del documento (§14.1): rechazo inmediato; entra a la lista como una discrepancia más
    if (!row) {
      if (scanOutRows(scope).some(function (o) { return norm(o.getAttribute("data-out-serial")) === code; })) {
        scanToast(scope, "dup", code);
        return;
      }
      scanAddOut(scope, code);
      scanToast(scope, "fuera", code);
      scanRefresh(scope);
      return;
    }
    // Match: confirmación inmediata
    row.setAttribute("data-scan-state", "confirmado");
    row.removeAttribute("data-novedad");
    row.classList.remove("u-flash"); void row.offsetWidth; row.classList.add("u-flash");
    scanToast(scope, "confirmado", code);
    scanRefresh(scope);
  }

  // Inyecta/quita el campo de observación bajo cada unidad marcada con novedad.
  function scanAuxRow(tr) {
    var n = tr.nextElementSibling;
    return (n && n.classList && (n.classList.contains("mt-nota-row") || n.classList.contains("rcp-motivo-row"))) ? n : null;
  }

  // Un serial rechazado (§14.1) lleva "comentario"; una unidad del documento, "motivo".
  function discKind(tr) { return tr.getAttribute("data-out-serial") ? "comentario" : "motivo"; }

  function scanRenderNovedadNotes(scope) {
    // Toda fila en discrepancia — sea unidad del documento o serial rechazado —
    // muestra su nota bajo la fila; si aún no la tiene, ofrece agregarla.
    function sync(tr, quiere) {
      var aux = scanAuxRow(tr);
      if (!quiere) { if (aux) aux.parentNode.removeChild(aux); return; }
      if (!aux) {
        aux = document.createElement("tr");
        aux.className = "rcp-motivo-row";
        aux.innerHTML = '<td colspan="7"></td>';
        tr.parentNode.insertBefore(aux, tr.nextSibling);
      }
      var k = discKind(tr);
      var txt = tr.getAttribute("data-nota") || "";
      aux.firstChild.innerHTML = txt
        ? '<div class="rcp-motivo"><span class="material-icons">edit_note</span>' +
          '<span><b>' + (k === "comentario" ? "Comentario" : "Motivo") + ':</b> ' + esc(txt) + '</span>' +
          '<button type="button" class="rcp-motivo-edit" data-disc-edit title="Editar el ' + k + '">' +
          '<span class="material-icons">edit</span></button></div>'
        : '<button type="button" class="rcp-motivo-add" data-disc-edit title="Escribir el ' + k + ' de esta discrepancia">' +
          '<span class="material-icons">add_comment</span> Agregar ' + k + '</button>';
    }

    scanRows(scope).forEach(function (tr) {
      sync(tr, tr.getAttribute("data-scan-state") === "discrepancia");
    });
    scanOutRows(scope).forEach(function (tr) { sync(tr, true); });
  }

  // Enter en el campo de escaneo
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Enter") return;
    var inp = e.target.closest && e.target.closest("[data-scan-input]");
    if (inp) {
      e.preventDefault();
      var scope = inp.closest("[data-scan-scope]");
      if (!scope) return;
      scanSubmit(scope, inp.value);
      inp.value = ""; inp.focus();
      return;
    }
    // Enter en el escaneo dirigido a UNA línea esperada
    var li = e.target.closest && e.target.closest("[data-line-input]");
    if (li) { e.preventDefault(); lineSubmit(li.closest(".mt-modal-overlay"), li.value); }
  });

  // ---- Escaneo contra una línea esperada (registra "llegó X en lugar de Y") ----
  function lineFeedback(modal, kind, html) {
    var fb = modal.querySelector("[data-line-feedback]");
    if (!fb) return;
    fb.className = "mt-alert " + (kind === "ok" ? "ok" : kind === "warn" ? "warn" : "err");
    fb.innerHTML = html; fb.style.display = "";
  }

  function lineSubmit(modal, value) {
    if (!modal || !modal.__row) return;
    var code = norm(value); if (!code) return;
    var row = modal.__row, scope = modal.__scope;
    var expected = norm(row.getAttribute("data-serial"));
    var inp = modal.querySelector("[data-line-input]");

    if (code === expected) {                        // llegó la unidad correcta → se confirma
      row.setAttribute("data-scan-state", "confirmado");
      row.removeAttribute("data-received");
      lineFeedback(modal, "ok", '<span class="material-icons">check_circle</span> Coincide con lo esperado: <b>' +
        code + '</b> queda <b>confirmada</b>.');
      scanRefresh(scope);
      if (inp) { inp.value = ""; inp.focus(); }
      return;
    }
    var otra = scanRows(scope).filter(function (t) { return norm(t.getAttribute("data-serial")) === code; })[0];
    if (otra) {                                     // pertenece a otra línea del mismo documento
      lineFeedback(modal, "warn", '<span class="material-icons">info</span> <b>' + code +
        '</b> sí pertenece a este documento, pero a <b>otra línea</b>. Escanéala en el campo general para confirmarla; ' +
        'esta acción es solo para registrar una unidad que <b>no viene</b> en el documento.');
      if (inp) { inp.value = ""; inp.focus(); }
      return;
    }
    // sustitución: llegó una unidad que no pertenece al documento
    row.setAttribute("data-scan-state", "discrepancia");
    row.setAttribute("data-received", code);
    row.setAttribute("data-nota", "Llegó " + code + " en lugar de la unidad esperada");
    scanAddOut(scope, code,
      "Llegó en lugar de " + row.getAttribute("data-serial") + " — no pertenece al documento",
      row.getAttribute("data-serial"));
    lineFeedback(modal, "err", '<span class="material-icons">swap_horiz</span> Registrada la discrepancia: se esperaba <b>' +
      row.getAttribute("data-serial") + '</b> y llegó <b>' + code + '</b>. ' +
      '<b>Ninguna de las dos se recibe</b>: la esperada queda como faltante y la recibida se rechaza por no pertenecer al documento origen (§14.1). Ambas van a reconciliación.');
    scanRefresh(scope);
    if (inp) { inp.value = ""; }
  }

  // Abrir el modal de escaneo por línea con el contexto de la fila
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-scan-line]");
    if (!b) return;
    var modal = document.getElementById(b.getAttribute("data-scan-line"));
    if (!modal) return;
    var tr = b.closest("tr");
    modal.__row = tr; modal.__scope = b.closest("[data-scan-scope]");
    function set(sel, val) { var el = modal.querySelector(sel); if (el) el.textContent = val; }
    set("[data-line-material]", tr.getAttribute("data-material") || "");
    set("[data-line-serial]", tr.getAttribute("data-serial") || "");
    var fb = modal.querySelector("[data-line-feedback]"); if (fb) fb.style.display = "none";
    var inp = modal.querySelector("[data-line-input]"); if (inp) inp.value = "";
    modal.classList.add("open");
    setTimeout(function () { if (inp) inp.focus(); }, 60);
  });

  // ---- Ventana emergente: motivo de la discrepancia ----
  // Marcar una unidad como discrepancia exige indicar POR QUÉ; el motivo queda
  // guardado en data-nota y se pinta bajo la fila (ver scanRenderNovedadNotes).
  function discModal() { return document.getElementById("m-discrepancia"); }

  function discSync() {
    var m = discModal(); if (!m) return;
    var ta = m.querySelector("[data-disc-input]");
    var btn = m.querySelector("[data-disc-save]");
    if (btn) btn.disabled = !(ta && ta.value.trim());
  }

  // Motivos rápidos: distintos según se anote una unidad del documento o un rechazado
  var DISC_PRESETS = {
    motivo: ["No llegó en el envío", "Llegó con la caja dañada",
             "Equipo golpeado / no enciende", "Cantidad menor a la esperada"],
    comentario: ["No pertenece a este envío", "Serial ilegible / mal escaneado",
                 "Llegó de más", "Corresponde a otro contratista"]
  };

  function discOpen(tr, scope) {
    var m = discModal(); if (!m || !tr) return;
    var isOut = !!tr.getAttribute("data-out-serial");
    var k = discKind(tr);
    m.__row = tr; m.__scope = scope;

    function set(sel, val) { var el = m.querySelector(sel); if (el) el.textContent = val; }
    set("[data-disc-title]", isOut ? "Agregar comentario" : "Registrar discrepancia");
    set("[data-disc-material]", tr.getAttribute("data-material") ||
        (isOut ? "No pertenece al documento 351" : "—"));
    set("[data-disc-serial]", tr.getAttribute("data-serial") || tr.getAttribute("data-out-serial") || "—");
    set("[data-disc-label]", isOut ? "Comentario del serial rechazado" : "Motivo de la discrepancia");
    set("[data-disc-savetxt]", isOut ? "Guardar comentario" : "Confirmar discrepancia");

    var hint = m.querySelector("[data-disc-hint]");
    if (hint) hint.innerHTML = isOut
      ? 'Este serial se escaneó pero <b>no pertenece al documento 351</b>, así que fue rechazado (§14.1). Deja constancia de <b>qué pasó</b>: el comentario queda visible en la lista y viaja a <b>reconciliación</b> (§11.5.6).'
      : 'Indica <b>por qué</b> esta unidad no se puede recibir. El motivo queda visible en la lista y viaja a <b>reconciliación</b> (§11.5.6).';

    var foot = m.querySelector("[data-disc-note]");
    if (foot) foot.innerHTML = isOut
      ? '<b>Al guardar:</b> el serial sigue <b>rechazado</b> y fuera del 101; solo se añade tu comentario como evidencia. Puedes editarlo después desde la lista.'
      : '<b>Al confirmar:</b> la unidad pasa a <b>Con discrepancia</b>, <b>no entra al 101</b> y el motivo queda registrado junto a ella. Puedes revertirla después desde el mismo botón de su fila.';

    var box = m.querySelector("[data-disc-presets]");
    if (box) box.innerHTML = DISC_PRESETS[k].map(function (t) {
      return '<button type="button" class="mt-chip chip-grey" data-disc-preset>' + esc(t) + "</button>";
    }).join("");

    var ta = m.querySelector("[data-disc-input]");
    if (ta) {
      ta.value = tr.getAttribute("data-nota") || "";
      ta.placeholder = "Escribe el " + k + " o elige uno de los anteriores…";
    }
    discSync();
    m.classList.add("open");
    setTimeout(function () { if (ta) ta.focus(); }, 60);
  }

  function discSave() {
    var m = discModal(); if (!m || !m.__row) return;
    var ta = m.querySelector("[data-disc-input]");
    var motivo = (ta && ta.value.trim()) || "";
    if (!motivo) return;
    var tr = m.__row;
    tr.setAttribute("data-nota", motivo);
    if (!tr.getAttribute("data-out-serial")) {          // unidad del documento
      // si venía confirmada, la unidad llegó pero con novedad
      if (tr.getAttribute("data-scan-state") === "confirmado") tr.setAttribute("data-novedad", "1");
      tr.setAttribute("data-scan-state", "discrepancia");
    }
    m.classList.remove("open");
    scanRefresh(m.__scope || tr.closest("[data-scan-scope]"));
  }

  // Filtros, buscador y acciones por fila
  document.addEventListener("click", function (e) {
    var fb = e.target.closest && e.target.closest("[data-scan-filter]");
    if (fb) {
      var sc = fb.closest("[data-scan-scope]");
      sc.setAttribute("data-scan-active", fb.getAttribute("data-scan-filter"));
      sc.querySelectorAll("[data-scan-filter]").forEach(function (b) { b.classList.toggle("active", b === fb); });
      scanApplyFilter(sc);
      return;
    }
    var mk = e.target.closest && e.target.closest("[data-scan-mark]");
    if (mk) {
      var tr = mk.closest("tr"), sc2 = mk.closest("[data-scan-scope]");
      var to = mk.getAttribute("data-scan-mark");
      var vuelve = tr.getAttribute("data-scan-state") === to;
      if (!vuelve) { discOpen(tr, sc2); return; }   // marcar → pedir el motivo
      // revertir: vuelve a Pendiente y se limpia el motivo
      tr.setAttribute("data-scan-state", "pendiente");
      tr.removeAttribute("data-novedad");
      tr.removeAttribute("data-nota");
      if (tr.getAttribute("data-received")) {
        // al revertir, deshace también el par: quita el serial recibido de los rechazados
        var esperado = tr.getAttribute("data-serial");
        tr.removeAttribute("data-received");
        scanOutRows(sc2).forEach(function (o) {
          var aux = scanAuxRow(o);
          if (o.getAttribute("data-out-linked") === esperado) {
            if (aux) aux.parentNode.removeChild(aux);
            o.parentNode.removeChild(o);
          }
        });
      }
      scanRefresh(sc2);
      return;
    }
    // lápiz de la fila de motivo → reabre la ventana sobre la unidad de arriba
    var ed = e.target.closest && e.target.closest("[data-disc-edit]");
    if (ed) {
      var mRow = ed.closest("tr.rcp-motivo-row");
      var unit = mRow && mRow.previousElementSibling;
      if (unit) discOpen(unit, ed.closest("[data-scan-scope]"));
      return;
    }
    // motivos rápidos de la ventana de discrepancia
    var pre = e.target.closest && e.target.closest("[data-disc-preset]");
    if (pre) {
      var ta = document.querySelector("#m-discrepancia [data-disc-input]");
      if (ta) { ta.value = pre.textContent.trim(); ta.focus(); discSync(); }
      return;
    }
    // confirmar la discrepancia con su motivo
    if (e.target.closest && e.target.closest("[data-disc-save]")) { discSave(); return; }
    var rm = e.target.closest && e.target.closest("[data-scan-out-remove]");
    if (rm) {
      var scRm = rm.closest("[data-scan-scope]"), trRm = rm.closest("tr");
      if (trRm) {
        var nRm = scanAuxRow(trRm);
        if (nRm) nRm.parentNode.removeChild(nRm);
        trRm.parentNode.removeChild(trRm);
      }
      scanRefresh(scRm);
      return;
    }
  });

  // (El reporte de novedad ahora se hace desde el botón report_problem de la fila,
  //  en la tabla de unidades — ver el handler de [data-scan-mark] más arriba.)

  document.addEventListener("input", function (e) {
    if (e.target.closest && e.target.closest("[data-disc-input]")) { discSync(); return; }
    var s = e.target.closest && e.target.closest("[data-scan-search]");
    if (s) { scanApplyFilter(s.closest("[data-scan-scope]")); return; }
  });

  // Al abrir un modal con panel de escaneo, enfocar el campo
  document.addEventListener("click", function (e) {
    var t = e.target.closest && e.target.closest("[data-open-modal]");
    if (!t) return;
    setTimeout(function () {
      var m = document.getElementById(t.getAttribute("data-open-modal"));
      var i = m && m.querySelector("[data-scan-input]");
      if (i) i.focus();
    }, 60);
  });

  // ======================================================================
  //  Material NO serializado que llegó pero no está en el documento 351.
  //  No se puede confirmar (§14.1): se registra como evidencia, con estado
  //  "Discrepancia · Fuera del documento", sin esperado ni valor.
  // ======================================================================
  function matModal() { return document.getElementById("m-mat-extra"); }

  function matSync() {
    var m = matModal(); if (!m) return;
    var nom = (m.querySelector("[data-mat-nombre]").value || "").trim();
    var cant = parseFloat(m.querySelector("[data-mat-cant]").value);
    var btn = m.querySelector("[data-mat-save]");
    if (btn) btn.disabled = !(nom && !isNaN(cant) && cant > 0);
  }

  function matOpen(tr, scope) {
    var m = matModal(); if (!m) return;
    var edita = !!tr;
    m.__row = tr || null; m.__scope = scope;
    function val(sel, v) { var el = m.querySelector(sel); if (el) el.value = v; }
    function txt(sel, v) { var el = m.querySelector(sel); if (el) el.textContent = v; }
    txt("[data-mat-title]", edita ? "Editar material no incluido" : "Material no incluido en el documento");
    txt("[data-mat-savetxt]", edita ? "Guardar cambios" : "Registrar material");
    val("[data-mat-nombre]", edita ? (tr.getAttribute("data-mat-nombre") || "") : "");
    val("[data-mat-cant]",   edita ? (tr.getAttribute("data-mat-cant") || "") : "");
    val("[data-mat-uom]",    edita ? (tr.getAttribute("data-mat-uom") || "UND") : "UND");
    val("[data-mat-nota]",   edita ? (tr.getAttribute("data-nota") || "") : "");
    matSync();
    m.classList.add("open");
    setTimeout(function () { var i = m.querySelector("[data-mat-nombre]"); if (i) i.focus(); }, 60);
  }

  // Pinta la fila del material + su fila de comentario debajo
  function matRender(tr) {
    var nom = tr.getAttribute("data-mat-nombre") || "";
    var cant = tr.getAttribute("data-mat-cant") || "";
    var uom = tr.getAttribute("data-mat-uom") || "";
    var nota = tr.getAttribute("data-nota") || "";
    tr.innerHTML =
      '<td class="left"><div class="rcp-mat-nom">' + esc(nom) + "</div>" +
        '<span class="small muted">No aparece en el documento 351</span></td>' +
      '<td><b>—</b><br><span class="small muted">sin cantidad esperada</span></td>' +
      '<td class="left"><b class="cell-mono">' + esc(cant) + " " + esc(uom) + "</b>" +
        '<div class="small muted">recibido físicamente</div></td>' +
      '<td class="cell-mono">—</td>' +
      '<td><div class="rcp-estado-acc"><div>' +
        '<span class="mt-chip chip-amber" title="Llegó pero no pertenece al documento 351: no se puede confirmar (§14.1). Queda como evidencia y va a reconciliación.">' +
        '<span class="material-icons">error</span> Discrepancia</span>' +
        '<div class="u-fuera-sub">Fuera del documento</div></div>' +
        '<span class="row-actions">' +
        '<button class="mt-icon-btn primary" data-mat-edit title="Editar este material"><span class="material-icons">edit</span></button>' +
        '<button class="mt-icon-btn warn" data-mat-remove title="Quitar este material de la lista"><span class="material-icons">delete</span></button>' +
        "</span></div></td>";

    var aux = tr.nextElementSibling;
    var has = aux && aux.classList && aux.classList.contains("rcp-matnota-row");
    if (!has) {
      aux = document.createElement("tr");
      aux.className = "rcp-matnota-row";
      aux.innerHTML = '<td colspan="5"></td>';
      tr.parentNode.insertBefore(aux, tr.nextSibling);
    }
    aux.firstChild.innerHTML = nota
      ? '<div class="rcp-motivo"><span class="material-icons">edit_note</span>' +
        '<span><b>Comentario:</b> ' + esc(nota) + "</span>" +
        '<button type="button" class="rcp-motivo-edit" data-mat-edit title="Editar el comentario">' +
        '<span class="material-icons">edit</span></button></div>'
      : '<button type="button" class="rcp-motivo-add" data-mat-edit title="Escribir el comentario de este material">' +
        '<span class="material-icons">add_comment</span> Agregar comentario</button>';
  }

  function matSave() {
    var m = matModal(); if (!m) return;
    var nom = (m.querySelector("[data-mat-nombre]").value || "").trim();
    var cant = parseFloat(m.querySelector("[data-mat-cant]").value);
    if (!nom || isNaN(cant) || cant <= 0) return;
    var tr = m.__row;
    if (!tr) {
      var body = document.querySelector("[data-mat-extra-body]");
      if (!body) return;
      tr = document.createElement("tr");
      tr.className = "u-fuera";
      tr.setAttribute("data-mat-extra", "1");
      body.appendChild(tr);
    }
    tr.setAttribute("data-mat-nombre", nom);
    tr.setAttribute("data-mat-cant", cant);
    tr.setAttribute("data-mat-uom", m.querySelector("[data-mat-uom]").value || "UND");
    tr.setAttribute("data-nota", (m.querySelector("[data-mat-nota]").value || "").trim());
    matRender(tr);
    m.classList.remove("open");
  }

  document.addEventListener("click", function (e) {
    if (!e.target.closest) return;
    if (e.target.closest("[data-mat-add]")) { matOpen(null); return; }
    var ed = e.target.closest("[data-mat-edit]");
    if (ed) {
      var row = ed.closest("tr");
      if (row && row.classList.contains("rcp-matnota-row")) row = row.previousElementSibling;
      matOpen(row);
      return;
    }
    var rm = e.target.closest("[data-mat-remove]");
    if (rm) {
      var r = rm.closest("tr"), n = r && r.nextElementSibling;
      if (n && n.classList && n.classList.contains("rcp-matnota-row")) n.parentNode.removeChild(n);
      if (r) r.parentNode.removeChild(r);
      return;
    }
    var pre = e.target.closest("[data-mat-preset]");
    if (pre) {
      var ta = matModal().querySelector("[data-mat-nota]");
      if (ta) { ta.value = pre.textContent.trim(); ta.focus(); }
      return;
    }
    if (e.target.closest("[data-mat-save]")) { matSave(); return; }
  });

  document.addEventListener("input", function (e) {
    if (e.target.closest && e.target.closest("#m-mat-extra")) matSync();
  });

  // --- Sección condicional: un <select data-toggle="#id" data-toggle-show="Valor">
  //     muestra el elemento destino solo cuando el select tiene ese valor. ---
  function applyToggle(sel) {
    var target = document.querySelector(sel.getAttribute("data-toggle"));
    if (!target) return;
    target.style.display = (sel.value === sel.getAttribute("data-toggle-show")) ? "" : "none";
  }
  document.addEventListener("change", function (e) {
    if (e.target && e.target.matches && e.target.matches("select[data-toggle]")) applyToggle(e.target);
  });

  /* ------------------------------------------------------------------
     Picker de doble lista (Asignación → Reasignar entre sublocaciones).
     Un solo pool de <li> (data-sl, data-code, data-name) que se reparte
     entre las dos listas según el estado de cada equipo:
       · de la sublocación ORIGEN y sin mover  → lista izquierda
       · movido por el usuario                 → lista derecha (activo)
       · de la sublocación DESTINO             → lista derecha en gris,
                                                 solo informativo
     El resto queda oculto. Origen y destino se excluyen mutuamente en
     los selects y el botón central los intercambia.
     ------------------------------------------------------------------ */
  var PK_MOVED = "1";

  function pkScope(p) { return p.closest(".mt-modal") || document; }
  function pkList(p, side) { return p.querySelector('[data-picker-list="' + side + '"]'); }
  function pkPool(p) { return [].slice.call(p.querySelectorAll("li[data-code]")); }
  function pkSel(p, attr) { return pkScope(p).querySelector("[" + attr + "]"); }
  function pkCode(v) { return (String(v || "").split("·")[0] || "").trim(); }
  function pkOrigin(p) { var s = pkSel(p, "data-picker-origin"); return s ? pkCode(s.value) : ""; }
  function pkTarget(p) { var s = pkSel(p, "data-picker-target"); return s ? pkCode(s.value) : ""; }

  function pkMatches(li, q) {
    if (!q) return true;
    return (li.getAttribute("data-code") + " " + li.getAttribute("data-name")).toUpperCase().indexOf(q) >= 0;
  }
  function pkQuery(p, side) {
    var inp = p.querySelector('[data-picker-search="' + side + '"]');
    return inp ? inp.value.trim().toUpperCase() : "";
  }

  // Reparte los <li> entre las dos listas y aplica búsqueda, contadores y
  // estado de los botones. Es la única función que toca el DOM del picker.
  function pkRefresh(p) {
    var origin = pkOrigin(p), target = pkTarget(p);
    var src = pkList(p, "src"), dst = pkList(p, "dst");
    if (!src || !dst) return;
    var qs = pkQuery(p, "src"), qd = pkQuery(p, "dst");
    var nSrc = 0, nMoved = 0, nOwned = 0, visSrc = 0, visDst = 0;

    pkPool(p).forEach(function (li) {
      var sl = li.getAttribute("data-sl");
      var moved = li.getAttribute("data-moved") === PK_MOVED;
      var owned = !moved && sl === target;
      var mine = !moved && sl === origin;
      var side = moved || owned ? "dst" : (mine ? "src" : null);

      li.classList.toggle("is-owned", owned);
      if (owned) li.classList.remove("sel");
      if (!side) { li.hidden = true; li.classList.remove("sel"); return; }

      var list = side === "src" ? src : dst;
      if (li.parentNode !== list) list.appendChild(li);

      var vis = pkMatches(li, side === "src" ? qs : qd);
      li.hidden = !vis;
      if (!vis) li.classList.remove("sel");
      if (side === "src") { nSrc++; if (vis) visSrc++; }
      else { if (moved) nMoved++; else nOwned++; if (vis) visDst++; }
    });

    // Los movidos van primero en la lista destino: es lo accionable.
    [].slice.call(dst.querySelectorAll('li[data-moved="' + PK_MOVED + '"]')).reverse().forEach(function (li) {
      dst.insertBefore(li, dst.firstChild);
    });

    pkEmpty(p, "src", nSrc, visSrc, origin, nMoved);
    pkEmpty(p, "dst", nMoved + nOwned, visDst, target, 0);

    var cSrc = p.querySelector('[data-picker-count="src"]');
    if (cSrc) cSrc.textContent = nSrc;
    var cDst = p.querySelector('[data-picker-count="dst"]');
    if (cDst) cDst.textContent = nMoved;
    var own = p.querySelector("[data-picker-owned]");
    if (own) {
      own.hidden = nOwned === 0;
      own.textContent = nOwned + " ya asignado" + (nOwned === 1 ? "" : "s");
    }

    var selectable = function (side, onlySel) {
      return pkPool(p).filter(function (li) {
        if (li.hidden || li.classList.contains("is-owned")) return false;
        var moved = li.getAttribute("data-moved") === PK_MOVED;
        if (side === "src" ? moved : !moved) return false;
        return onlySel ? li.classList.contains("sel") : true;
      }).length;
    };
    var set = function (dir, on) {
      var b = p.querySelector('[data-picker-move="' + dir + '"]');
      if (b) b.disabled = !on;
    };
    set("right", selectable("src", true) > 0);
    set("all-right", selectable("src", false) > 0);
    set("left", selectable("dst", true) > 0);
    set("all-left", selectable("dst", false) > 0);

    var sum = pkScope(p).querySelector("[data-picker-summary]");
    if (sum) sum.textContent = nMoved;
    var go = pkScope(p).querySelector("[data-picker-submit]");
    if (go) go.disabled = nMoved === 0;
  }

  function pkEmpty(p, side, total, visible, sl, moved) {
    var box = pkList(p, side);
    var empty = box && box.querySelector("[data-picker-empty]");
    if (!empty) return;
    empty.hidden = visible > 0;
    if (total > 0) { empty.textContent = "Ningún equipo coincide con la búsqueda"; return; }
    if (side === "src" && moved > 0) { empty.textContent = "Todos los equipos pasaron al destino"; return; }
    empty.textContent = "Sin equipos en " + (sl || (side === "src" ? "la sublocación origen" : "la sublocación destino"));
  }

  function pkMove(p, dir) {
    var toDst = dir.indexOf("right") >= 0;
    var all = dir.indexOf("all-") === 0;
    pkPool(p).forEach(function (li) {
      if (li.classList.contains("is-owned")) return;
      var moved = li.getAttribute("data-moved") === PK_MOVED;
      if (toDst === moved) return;                 // ya está del lado destino
      if (li.hidden) return;                       // fuera de la búsqueda activa
      if (!all && !li.classList.contains("sel")) return;
      li.classList.remove("sel");
      if (toDst) li.setAttribute("data-moved", PK_MOVED);
      else li.removeAttribute("data-moved");
    });
    pkRefresh(p);
  }

  // Origen y destino no pueden ser la misma sublocación: la elegida de un
  // lado se oculta como opción del otro.
  function pkSyncSelects(p, changed) {
    var o = pkSel(p, "data-picker-origin"), t = pkSel(p, "data-picker-target");
    if (!o || !t) return;
    // 1. Si ambos quedaron en la misma sublocación, el que NO tocó el usuario
    //    salta a la primera opción libre.
    if (pkCode(o.value) === pkCode(t.value)) {
      var fixed = changed === t ? t : o;   // al iniciar manda el origen
      var other = fixed === o ? t : o;
      var free = [].slice.call(other.options).filter(function (op) {
        return pkCode(op.value) !== pkCode(fixed.value);
      })[0];
      if (free) other.value = free.value;
    }
    // 2. La sublocación elegida de un lado desaparece de las opciones del otro.
    [[o, t], [t, o]].forEach(function (pair) {
      [].slice.call(pair[0].options).forEach(function (op) {
        var clash = pkCode(op.value) === pkCode(pair[1].value);
        op.hidden = clash;
        op.disabled = clash;
      });
    });
    pkLabels(p);
  }

  function pkLabels(p) {
    var o = pkSel(p, "data-picker-origin"), t = pkSel(p, "data-picker-target");
    var l1 = pkScope(p).querySelector("[data-picker-src-label]");
    var l2 = pkScope(p).querySelector("[data-picker-dst-label]");
    if (o && l1) l1.textContent = pkCode(o.value);
    if (t && l2) l2.textContent = pkCode(t.value);
  }

  // Cambiar de técnico descarta lo que estaba en curso: los equipos vuelven
  // a su sublocación de origen.
  function pkReset(p) {
    pkPool(p).forEach(function (li) { li.removeAttribute("data-moved"); li.classList.remove("sel"); });
  }

  // El propio buscador de origen hace de campo de escaneo: al escanear (o pulsar
  // el ícono) el equipo pasa directo a la sublocación destino.
  function pkScan(p) {
    if (!p) return;
    var inp = p.querySelector('[data-picker-search="src"]');
    var code = inp ? inp.value.trim().toUpperCase() : "";
    if (!code) { if (inp) inp.focus(); return; }
    var pend = pkPool(p).filter(function (li) {
      return li.getAttribute("data-sl") === pkOrigin(p) && li.getAttribute("data-moved") !== PK_MOVED;
    });
    var hit = pend.filter(function (li) { return li.getAttribute("data-code").toUpperCase() === code; })[0];
    if (!hit && pend.length === 1) hit = pend[0];   // filtro que dejó un único equipo
    if (hit) {
      hit.setAttribute("data-moved", PK_MOVED);
      hit.classList.remove("sel");
      if (inp) inp.value = "";
    }
    if (inp) inp.focus();
    pkRefresh(p);
  }

  document.addEventListener("click", function (e) {
    if (!e.target.closest) return;
    var btn = e.target.closest("[data-picker-move]");
    if (btn) { pkMove(btn.closest("[data-picker]"), btn.getAttribute("data-picker-move")); return; }
    var sw = e.target.closest("[data-picker-swap]");
    if (sw) {
      var ps = document.querySelector("[data-picker]");
      if (!ps) return;
      var o = pkSel(ps, "data-picker-origin"), t = pkSel(ps, "data-picker-target");
      if (!o || !t) return;
      var a = o.value, b = t.value;
      [].slice.call(o.options).concat([].slice.call(t.options)).forEach(function (op) { op.hidden = false; op.disabled = false; });
      o.value = b; t.value = a;
      pkReset(ps); pkSyncSelects(ps, o); pkRefresh(ps);
      return;
    }
    if (e.target.closest("[data-picker-scan-btn]")) { pkScan(document.querySelector("[data-picker]")); return; }
    var li = e.target.closest("[data-picker] li[data-code]");
    if (li && !li.classList.contains("is-owned")) {
      li.classList.toggle("sel");
      pkRefresh(li.closest("[data-picker]"));
    }
  });

  document.addEventListener("dblclick", function (e) {
    if (!e.target.closest) return;
    var li = e.target.closest("[data-picker] li[data-code]");
    if (!li || li.classList.contains("is-owned")) return;
    var p = li.closest("[data-picker]");
    li.classList.add("sel");
    pkMove(p, li.getAttribute("data-moved") === PK_MOVED ? "left" : "right");
  });

  document.addEventListener("input", function (e) {
    if (e.target.matches && e.target.matches("[data-picker-search]")) pkRefresh(e.target.closest("[data-picker]"));
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && e.target.matches && e.target.matches('[data-picker-search="src"]')) {
      e.preventDefault();
      pkScan(e.target.closest("[data-picker]"));
    }
  });

  document.addEventListener("change", function (e) {
    if (!e.target.matches) return;
    if (e.target.matches("[data-picker-origin], [data-picker-target]")) {
      var p = document.querySelector("[data-picker]");
      if (!p) return;
      pkReset(p);
      pkSyncSelects(p, e.target);
      pkRefresh(p);
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    [].slice.call(document.querySelectorAll("[data-picker]")).forEach(function (p) {
      pkSyncSelects(p, null);
      pkRefresh(p);
    });
  });

})();
