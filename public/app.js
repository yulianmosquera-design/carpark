// ====================================================================
// PARQUEADERO AUTOS COLOMBIA - LOGICA CLIENTE (FRONTEND JS)
// ====================================================================

const app = {
  activeTab: 'dashboard',
  currentLiquidacion: null,

  init() {
    this.setupNavigation();
    this.setupClock();
    this.setupFormListeners();
    this.refreshAll();

    // Auto-refresco cada 15 segundos
    setInterval(() => {
      if (this.activeTab === 'dashboard' || this.activeTab === 'celdas') {
        this.refreshAll();
      }
    }, 15000);
  },

  // NAVEGACIÓN
  setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        this.switchTab(targetTab);
      });
    });
  },

  switchTab(tabId) {
    this.activeTab = tabId;

    // Actualizar botones del sidebar
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });

    // Actualizar paneles
    document.querySelectorAll('.tab-pane').forEach(pane => {
      pane.classList.remove('active');
    });

    const activePane = document.getElementById(`tab-${tabId}`);
    if (activePane) activePane.classList.add('active');

    // Títulos
    const titles = {
      dashboard: 'Panel de Control General',
      entrada: 'Registrar Entrada de Vehículo',
      salida: 'Liquidación y Salida de Vehículo',
      celdas: 'Distribución y Mapa de Celdas',
      novedades: 'Bitácora de Novedades e Inspección',
      mensualidades: 'Control de Mensualidades y Abonados'
    };
    document.getElementById('current-section-title').textContent = titles[tabId] || 'Autos Colombia';

    // Cargar datos específicos si aplica
    if (tabId === 'entrada') {
      this.cargarCeldasDisponibles();
    } else if (tabId === 'celdas') {
      this.cargarMapaCeldas();
    } else if (tabId === 'novedades') {
      this.cargarNovedades();
    } else if (tabId === 'mensualidades') {
      this.cargarMensualidades();
    }
  },

  // RELOJ EN VIVO
  setupClock() {
    const updateTime = () => {
      const now = new Date();
      document.getElementById('live-clock').textContent = now.toLocaleTimeString('es-CO', { hour12: false });
    };
    updateTime();
    setInterval(updateTime, 1000);
  },

  // CARGA GENERAL
  async refreshAll() {
    await Promise.all([
      this.cargarDashboard(),
      this.cargarCeldasDisponibles()
    ]);
  },

  // DASHBOARD
  async cargarDashboard() {
    try {
      const res = await fetch('/api/dashboard');
      const data = await res.json();
      if (!data.success) return;

      const { stats, vehiculosEstacionados } = data;

      // Métricas Principales (Estilo CarPark)
      const elTotalReg = document.getElementById('metric-total-reg');
      if (elTotalReg) elTotalReg.textContent = '10k';

      const elActiveUsers = document.getElementById('metric-active-users');
      if (elActiveUsers) elActiveUsers.textContent = '357';

      const elAvailSpots = document.getElementById('metric-available-spots');
      if (elAvailSpots) elAvailSpots.textContent = stats.celdasDisponibles;

      const elEstacionados = document.getElementById('metric-estacionados');
      if (elEstacionados) elEstacionados.textContent = stats.vehiculosEnParqueadero;

      // Fallbacks para métricas legacy si existen
      const percent = stats.totalCeldas > 0 ? Math.round((stats.celdasOcupadas / stats.totalCeldas) * 100) : 0;
      const elPercent = document.getElementById('metric-percent');
      if (elPercent) elPercent.textContent = `${percent}%`;

      const elOcupadas = document.getElementById('metric-ocupadas');
      if (elOcupadas) elOcupadas.textContent = `${stats.celdasOcupadas} / ${stats.totalCeldas}`;

      const elProgressBar = document.getElementById('metric-progress-bar');
      if (elProgressBar) elProgressBar.style.width = `${percent}%`;

      const elDispTxt = document.getElementById('metric-disponibles-txt');
      if (elDispTxt) elDispTxt.textContent = `${stats.celdasDisponibles} celdas libres`;

      const elEntradas = document.getElementById('metric-entradas');
      if (elEntradas) elEntradas.textContent = stats.entradasHoy;

      const elRecaudado = document.getElementById('metric-recaudado');
      if (elRecaudado) elRecaudado.textContent = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(stats.recaudadoHoy);

      // Tabla de Estacionados
      this.renderTablaEstacionados(vehiculosEstacionados);

      // Lista rápida de salida
      this.renderListaSalidaRapida(vehiculosEstacionados);

      // Selector para modal de novedades
      this.renderSelectorNovedades(vehiculosEstacionados);

    } catch (err) {
      console.error('Error al cargar dashboard:', err);
    }
  },

  renderTablaEstacionados(lista) {
    const tbody = document.getElementById('tbody-estacionados');
    if (!lista || lista.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center" style="padding: 24px; color: var(--text-muted);">No hay vehículos estacionados actualmente</td></tr>`;
      return;
    }

    tbody.innerHTML = lista.map(v => `
      <tr>
        <td><strong class="uppercase-input" style="font-size: 1.05rem; color: #FFFFFF;">${v.placa}</strong></td>
        <td><span class="badge ${v.tipo_vehiculo === 'Motocicleta' ? 'badge-horas' : 'badge-mensualidad'}">${v.tipo_vehiculo}</span></td>
        <td><strong style="color: var(--primary);">${v.celda_codigo}</strong> <small>(${v.piso_zona})</small></td>
        <td>${v.fecha_hora_entrada}</td>
        <td>
          <span class="badge ${v.tipo_servicio === 'MENSUALIDAD' ? 'badge-activa' : 'badge-horas'}">
            ${v.tipo_servicio}
          </span>
        </td>
        <td>
          ${v.total_novedades > 0 
            ? `<span class="badge badge-media">⚠️ ${v.total_novedades} novedad(es)</span>` 
            : `<span style="color: #94a3b8; font-size: 0.8rem;">Sin novedad</span>`}
        </td>
        <td>
          <button class="btn btn-secondary" style="padding: 6px 10px; font-size: 0.78rem;" onclick="app.seleccionarParaSalida('${v.placa}')">
            🚙 Salida
          </button>
        </td>
      </tr>
    `).join('');
  },

  renderListaSalidaRapida(lista) {
    const container = document.getElementById('quick-exit-list');
    if (!lista || lista.length === 0) {
      container.innerHTML = `<p style="color: var(--text-muted); font-size: 0.85rem;">No hay vehículos en parqueadero para liquidar.</p>`;
      return;
    }

    container.innerHTML = lista.map(v => `
      <div class="quick-exit-item" onclick="app.seleccionarParaSalida('${v.placa}')">
        <div>
          <span class="quick-placa">${v.placa}</span>
          <div class="quick-meta">${v.tipo_vehiculo} • Celda ${v.celda_codigo}</div>
        </div>
        <div>
          <span class="badge ${v.tipo_servicio === 'MENSUALIDAD' ? 'badge-activa' : 'badge-horas'}">${v.tipo_servicio}</span>
          <div class="quick-meta text-right" style="margin-top: 4px;">Entrada: ${v.fecha_hora_entrada.slice(11, 16)}</div>
        </div>
      </div>
    `).join('');
  },

  renderSelectorNovedades(lista) {
    const select = document.getElementById('nov-select-estadia');
    if (!select) return;
    select.innerHTML = '<option value="">Seleccione vehículo...</option>' + 
      lista.map(v => `<option value="${v.registro_id}" data-vehiculo="${v.placa}">${v.placa} - Celda ${v.celda_codigo} (${v.tipo_vehiculo})</option>`).join('');
  },

  // VERIFICAR PLACA EN ENTRADA
  async verificarPlaca() {
    const input = document.getElementById('ent-placa');
    const placa = input.value.trim().toUpperCase();
    const feedback = document.getElementById('placa-feedback');

    if (!placa) {
      feedback.className = 'feedback-msg error';
      feedback.textContent = 'Ingrese una placa para verificar';
      return;
    }

    try {
      const res = await fetch(`/api/vehiculo/consultar?placa=${placa}`);
      const data = await res.json();
      if (!data.success) return;

      const v = data.data;

      if (v.tieneEstadiaActiva) {
        feedback.className = 'feedback-msg error';
        feedback.textContent = '⚠️ Este vehículo ya está dentro del parqueadero actualmente.';
        return;
      }

      if (v.tieneMensualidadActiva) {
        feedback.className = 'feedback-msg success';
        feedback.innerHTML = `✅ <strong>Abonado Activo:</strong> ${v.mensualidad.nombres} ${v.mensualidad.apellidos}. Mensualidad Vigente hasta ${v.mensualidad.fecha_fin}. Entrada Exenta de cobro por horas.`;
        // Prellenar tipo y datos si existen
        if (v.vehiculo) {
          document.getElementById('ent-tipo').value = v.vehiculo.tipo_vehiculo_id;
          document.getElementById('ent-marca').value = v.vehiculo.marca || '';
          document.getElementById('ent-color').value = v.vehiculo.color || '';
          this.cargarCeldasDisponibles();
        }
      } else if (v.existe) {
        feedback.className = 'feedback-msg warning';
        feedback.textContent = 'ℹ️ Vehículo registrado previamente (Cliente por Horas).';
        document.getElementById('ent-tipo').value = v.vehiculo.tipo_vehiculo_id;
        document.getElementById('ent-marca').value = v.vehiculo.marca || '';
        document.getElementById('ent-color').value = v.vehiculo.color || '';
        this.cargarCeldasDisponibles();
      } else {
        feedback.className = 'feedback-msg';
        feedback.style.color = '#2563eb';
        feedback.textContent = '✨ Vehículo nuevo. Se registrará en la base de datos automáticamente.';
      }
    } catch (err) {
      console.error(err);
    }
  },

  // CELDAS DISPONIBLES EN FORM ENTRADA
  async cargarCeldasDisponibles() {
    const tipoId = document.getElementById('ent-tipo') ? document.getElementById('ent-tipo').value : 1;
    const select = document.getElementById('ent-celda');
    if (!select) return;

    try {
      const res = await fetch(`/api/celdas/disponibles?tipo=${tipoId}`);
      const json = await res.json();
      if (!json.success) return;

      if (json.data.length === 0) {
        select.innerHTML = '<option value="">⚠️ No hay celdas disponibles para este tipo</option>';
        return;
      }

      select.innerHTML = json.data.map(c => `
        <option value="${c.id}">${c.codigo} (${c.piso_zona})</option>
      `).join('');
    } catch (err) {
      console.error(err);
    }
  },

  // SUBMIT ENTRADA
  setupFormListeners() {
    const formEntrada = document.getElementById('form-entrada');
    if (formEntrada) {
      formEntrada.addEventListener('submit', async (e) => {
        e.preventDefault();

        const placa = document.getElementById('ent-placa').value.trim().toUpperCase();
        const tipoId = document.getElementById('ent-tipo').value;
        const celdaId = document.getElementById('ent-celda').value;
        const marca = document.getElementById('ent-marca').value;
        const color = document.getElementById('ent-color').value;

        // Novedad si el acordeón se abrió y tiene texto
        const novDesc = document.getElementById('ent-nov-desc').value.trim();
        let novedad = null;
        if (novDesc) {
          novedad = {
            tipo: document.getElementById('ent-nov-tipo').value,
            ubicacion: document.getElementById('ent-nov-ubicacion').value,
            descripcion: novDesc
          };
        }

        const payload = {
          placa,
          tipo_vehiculo_id: tipoId,
          celda_id: celdaId,
          marca,
          color,
          novedad
        };

        try {
          const res = await fetch('/api/entrada', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          const result = await res.json();
          if (!result.success) {
            alert('Error al registrar entrada: ' + result.error);
            return;
          }

          // Mostrar ticket térmico
          this.mostrarTicketEntrada({
            ticketCodigo: result.ticketCodigo,
            placa: result.placa,
            celdaCodigo: document.getElementById('ent-celda').selectedOptions[0]?.text || '',
            tipoVehiculo: document.getElementById('ent-tipo').selectedOptions[0]?.text || '',
            fechaHora: new Date().toLocaleString('es-CO'),
            tipoServicio: result.tipoServicio,
            novedad: novedad ? novedad.descripcion : null
          });

          // Limpiar form
          formEntrada.reset();
          document.getElementById('placa-feedback').textContent = '';
          document.getElementById('accordion-body').classList.add('hidden');
          this.refreshAll();
        } catch (err) {
          alert('Error de conexión con el servidor');
        }
      });
    }

    // Filtro de búsqueda en tabla estacionados y topbar
    const handleFilter = (val) => {
      const lower = val.toLowerCase();
      const rows = document.querySelectorAll('#tbody-estacionados tr');
      rows.forEach(r => {
        r.style.display = r.textContent.toLowerCase().includes(lower) ? '' : 'none';
      });
    };

    const filterInput = document.getElementById('filter-estacionados');
    if (filterInput) {
      filterInput.addEventListener('input', (e) => handleFilter(e.target.value));
    }

    const topSearch = document.getElementById('top-search-input');
    if (topSearch) {
      topSearch.addEventListener('input', (e) => {
        if (this.activeTab !== 'dashboard') this.switchTab('dashboard');
        handleFilter(e.target.value);
      });
    }
  },

  toggleNovedadSection() {
    const body = document.getElementById('accordion-body');
    const arrow = document.getElementById('accordion-arrow');
    body.classList.toggle('hidden');
    arrow.textContent = body.classList.contains('hidden') ? '▼' : '▲';
  },

  mostrarTicketEntrada(datos) {
    document.getElementById('tck-codigo').textContent = datos.ticketCodigo;
    document.getElementById('tck-placa').textContent = datos.placa;
    document.getElementById('tck-celda').textContent = datos.celdaCodigo;
    document.getElementById('tck-tipo').textContent = datos.tipoVehiculo.split('(')[0];
    document.getElementById('tck-fecha').textContent = datos.fechaHora;
    document.getElementById('tck-modalidad').textContent = datos.tipoServicio;

    const novBox = document.getElementById('tck-novedades-box');
    if (datos.novedad) {
      novBox.classList.remove('hidden');
      document.getElementById('tck-novedad-txt').textContent = datos.novedad;
    } else {
      novBox.classList.add('hidden');
    }

    document.getElementById('modal-ticket').classList.remove('hidden');
  },

  // LIQUIDAR SALIDA
  seleccionarParaSalida(placa) {
    this.switchTab('salida');
    document.getElementById('sal-criterio').value = placa;
    this.liquidarSalida();
  },

  async liquidarSalida() {
    const input = document.getElementById('sal-criterio');
    const criterio = input.value.trim().toUpperCase();

    if (!criterio) {
      alert('Ingrese una placa o número de ticket');
      return;
    }

    try {
      const res = await fetch(`/api/salida/liquidar?criterio=${encodeURIComponent(criterio)}`);
      const data = await res.json();

      if (!data.success) {
        alert('Error: ' + data.error);
        return;
      }

      const liq = data.data;
      this.currentLiquidacion = liq;

      // Mostrar panel
      document.getElementById('panel-liquidacion').classList.remove('hidden');
      document.getElementById('liq-placa').textContent = liq.estadia.placa;
      document.getElementById('liq-tipo-servicio').textContent = liq.estadia.tipo_servicio;
      document.getElementById('liq-tipo-servicio').className = `badge ${liq.esMensualidad ? 'badge-activa' : 'badge-horas'}`;

      document.getElementById('liq-tipo-vehiculo').textContent = liq.estadia.tipo_nombre;
      document.getElementById('liq-celda').textContent = `${liq.estadia.celda_codigo} (${liq.estadia.piso_zona})`;
      document.getElementById('liq-entrada').textContent = liq.fechaHoraEntrada;
      document.getElementById('liq-salida').textContent = liq.fechaHoraSalida;
      document.getElementById('liq-tiempo').textContent = `${liq.totalMinutos} minutos (~${liq.horasACobrar} hora(s))`;
      document.getElementById('liq-tarifa').textContent = `$${liq.tarifaHora.toLocaleString('es-CO')} / hr`;

      const formatCurrency = (val) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

      document.getElementById('liq-total').textContent = formatCurrency(liq.totalPagar);

      const nota = document.getElementById('liq-nota');
      const paymentBox = document.getElementById('payment-selection-box');

      if (liq.esMensualidad) {
        nota.textContent = 'Vehículo exento de cobro por contar con mensualidad activa.';
        paymentBox.style.display = 'none';
      } else {
        nota.textContent = `Cobro aplicado: ${liq.horasACobrar} hora(s) a $${liq.tarifaHora.toLocaleString('es-CO')}.`;
        paymentBox.style.display = 'block';
      }

    } catch (err) {
      alert('Error al liquidar salida');
    }
  },

  async confirmarSalida() {
    if (!this.currentLiquidacion) return;

    const criterio = document.getElementById('sal-criterio').value.trim();
    const metodoPago = document.querySelector('input[name="metodo_pago"]:checked')?.value || 'EFECTIVO';

    try {
      const res = await fetch('/api/salida', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ criterio, metodo_pago: metodoPago })
      });

      const data = await res.json();
      if (!data.success) {
        alert('Error: ' + data.error);
        return;
      }

      alert(`✅ Salida confirmada exitosamente.\nVehículo: ${data.placa}\nCelda liberada: ${data.celdaLiberada}\nTotal: $${data.totalPagar.toLocaleString('es-CO')}`);

      // Ocultar panel y limpiar
      document.getElementById('panel-liquidacion').classList.add('hidden');
      document.getElementById('sal-criterio').value = '';
      this.currentLiquidacion = null;

      this.refreshAll();
    } catch (err) {
      alert('Error de conexión al confirmar salida');
    }
  },

  // MAPA DE CELDAS
  async cargarMapaCeldas() {
    try {
      const res = await fetch('/api/celdas');
      const json = await res.json();
      if (!json.success) return;

      const container = document.getElementById('celdas-grid');

      // Agrupar por zona
      const zonas = {};
      json.data.forEach(c => {
        if (!zonas[c.piso_zona]) zonas[c.piso_zona] = [];
        zonas[c.piso_zona].push(c);
      });

      container.innerHTML = Object.entries(zonas).map(([zona, celdas]) => `
        <div class="zona-block">
          <h4>📍 ${zona} (${celdas.filter(c => c.estado === 'DISPONIBLE').length} libres de ${celdas.length})</h4>
          <div class="zona-grid">
            ${celdas.map(c => `
              <div class="celda-box ${c.estado}">
                <span class="celda-code">${c.codigo}</span>
                <span class="celda-status-label">${c.estado}</span>
                ${c.placa_ocupante ? `<span class="celda-placa-badge">${c.placa_ocupante}</span>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `).join('');
    } catch (err) {
      console.error(err);
    }
  },

  // NOVEDADES
  async cargarNovedades() {
    try {
      const res = await fetch('/api/novedades');
      const json = await res.json();
      if (!json.success) return;

      const tbody = document.getElementById('tbody-novedades');
      if (json.data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center">No hay novedades registradas</td></tr>`;
        return;
      }

      tbody.innerHTML = json.data.map(n => `
        <tr>
          <td>${n.fecha_hora}</td>
          <td><strong class="uppercase-input">${n.placa}</strong></td>
          <td>${n.ticket_codigo}</td>
          <td>${n.tipo_novedad}</td>
          <td><span class="badge badge-${n.gravedad.toLowerCase()}">${n.gravedad}</span></td>
          <td><strong>${n.ubicacion_dano || 'General'}:</strong> ${n.descripcion}</td>
          <td>${n.operador}</td>
        </tr>
      `).join('');
    } catch (err) {
      console.error(err);
    }
  },

  abrirModalNovedad() {
    document.getElementById('modal-nueva-novedad').classList.remove('hidden');
  },

  async guardarNovedadManual(e) {
    e.preventDefault();
    const select = document.getElementById('nov-select-estadia');
    const registroId = select.value;
    if (!registroId) {
      alert('Seleccione un vehículo');
      return;
    }

    const tipo = document.getElementById('nov-modal-tipo').value;
    const gravedad = document.getElementById('nov-modal-gravedad').value;
    const ubicacion = document.getElementById('nov-modal-ubicacion').value;
    const desc = document.getElementById('nov-modal-desc').value;

    try {
      // Necesitamos el vehiculo_id del registro
      const dashboard = await fetch('/api/dashboard').then(r => r.json());
      const vObj = dashboard.vehiculosEstacionados.find(v => v.registro_id == registroId);

      const res = await fetch('/api/novedades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registro_estadia_id: registroId,
          vehiculo_id: vObj ? vObj.vehiculo_id || 1 : 1,
          tipo_novedad: tipo,
          descripcion: desc,
          gravedad,
          ubicacion_dano: ubicacion
        })
      });

      const data = await res.json();
      if (data.success) {
        alert('Novedad guardada correctamente');
        this.cerrarModal('modal-nueva-novedad');
        document.getElementById('form-nueva-novedad').reset();
        this.cargarNovedades();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      alert('Error de conexión');
    }
  },

  // MENSUALIDADES
  async cargarMensualidades() {
    try {
      const res = await fetch('/api/mensualidades');
      const json = await res.json();
      if (!json.success) return;

      const tbody = document.getElementById('tbody-mensualidades');
      tbody.innerHTML = json.data.map(m => `
        <tr>
          <td>${m.tipo_documento} ${m.documento}</td>
          <td><strong>${m.nombres} ${m.apellidos}</strong></td>
          <td>📞 ${m.telefono}</td>
          <td><span class="celda-placa-badge">${m.placa || 'N/A'}</span></td>
          <td>${m.fecha_inicio || '---'}</td>
          <td>${m.fecha_fin || '---'}</td>
          <td>
            <span class="badge ${m.estado_mensualidad === 'ACTIVA' ? 'badge-activa' : 'badge-vencida'}">
              ${m.estado_mensualidad || 'SIN PLAN'}
            </span>
          </td>
        </tr>
      `).join('');
    } catch (err) {
      console.error(err);
    }
  },

  cerrarModal(id) {
    document.getElementById(id).classList.add('hidden');
  }
};

// Iniciar app al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
