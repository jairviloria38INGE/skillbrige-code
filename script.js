/**
 * CODE — Plataforma de Conexión entre MiPyMes y Talento Tecnológico
 * Archivo: js/script.js
 * Propósito: Navegación móvil, simulador interactivo de landing page y filtros de catálogo.
 * Autores: Jared Arenas, Frederick Vargas, Jair Viloria
 */

/* Función utilitaria de escape HTML (disponible globalmente en este archivo,
   independiente del orden de carga de matching.js) */
function escapeHtml(string) {
  if (!string) return '';
  return String(string)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

document.addEventListener('DOMContentLoaded', function() {
  /* Garantizar que los datos semilla estén en localStorage antes de
     renderizar cualquier componente dinámico */
  if (typeof initSeedData === 'function') {
    initSeedData();
  }
  initMobileNav();
  initSidebarToggle();
  initLandingSimulator();
  initOpportunitiesCatalog();
});

/* ==========================================================================
   1. NAVEGACIÓN MÓVIL Y SIDEBAR
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('btn-menu-toggle');
  const navLinks = document.getElementById('primary-nav');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', function() {
      const isOpen = navLinks.classList.contains('is-open');
      if (isOpen) {
        navLinks.classList.remove('is-open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      } else {
        navLinks.classList.add('is-open');
        toggleBtn.setAttribute('aria-expanded', 'true');
      }
    });

    // Cerrar al hacer clic en un enlace de navegación
    const navItems = navLinks.querySelectorAll('a');
    navItems.forEach(function(item) {
      item.addEventListener('click', function() {
        navLinks.classList.remove('is-open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

function initSidebarToggle() {
  const sidebarToggle = document.querySelector('.sidebar-toggle');
  const sidebar = document.querySelector('.dashboard-sidebar');

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('is-open');
    });

    // Cerrar sidebar al hacer clic fuera en pantallas móviles
    document.addEventListener('click', function(event) {
      if (window.innerWidth <= 768 && sidebar.classList.contains('is-open')) {
        if (!sidebar.contains(event.target) && !sidebarToggle.contains(event.target)) {
          sidebar.classList.remove('is-open');
        }
      }
    });
  }
}

/* ==========================================================================
   2. SIMULADOR RÁPIDO DE LA LANDING PAGE (index.html)
   ========================================================================== */
function initLandingSimulator() {
  const btnSimulate = document.getElementById('btn-run-simulation');
  const simResult = document.getElementById('sim-result');
  if (!btnSimulate || !simResult) return;

  btnSimulate.addEventListener('click', function() {
    const sector = document.getElementById('sim-sector').value;
    const problem = document.getElementById('sim-problem').value;

    let solTitle = 'Catálogo Digital Interactivo con Pedidos a WhatsApp';
    let solDesc = 'Menú web responsive optimizado para teléfonos móviles donde los clientes eligen platos o cafés, arman su pedido y envían el mensaje formateado sin fricciones.';
    let solTime = '2 a 3 semanas';
    let solCost = '$750.000 COP';
    let techStack = 'HTML5 • CSS3 • JavaScript';

    if (problem === 'inventario') {
      solTitle = 'Control Web de Inventario y Caja Local';
      solDesc = 'Aplicación frontend liviana con persistencia local para alertar productos agotados, registrar ventas diarias y generar reportes de cierre.';
      solTime = '3 a 4 semanas';
      solCost = '$1.100.000 COP';
      techStack = 'JavaScript • LocalStorage • UI/UX';
    } else if (problem === 'visibilidad') {
      solTitle = 'Vitrina Web Institucional y Presencia en Google Maps';
      solDesc = 'Página web accesible y rápida con catálogo de servicios, galería de productos, geolocalización y contacto directo por WhatsApp.';
      solTime = '2 semanas';
      solCost = '$650.000 COP';
      techStack = 'HTML5 Semántico • CSS3';
    } else if (problem === 'cotizaciones') {
      solTitle = 'Generador Web de Cotizaciones Automáticas';
      solDesc = 'Calculadora interactiva en línea donde tus clientes corporativos configuran su pedido y descargan la cotización al instante.';
      solTime = '3 semanas';
      solCost = '$850.000 COP';
      techStack = 'HTML5 • CSS3 • JavaScript';
    }

    simResult.innerHTML = 
      '<article class="sim-result-card">' +
        '<div class="sim-result-header">' +
          '<span class="sim-badge">Estimación Preliminar</span>' +
          '<span class="tag">' + techStack + '</span>' +
        '</div>' +
        '<h4>' + solTitle + '</h4>' +
        '<p class="sim-result-desc">' + solDesc + '</p>' +
        '<div class="sim-result-metrics">' +
          '<div class="sim-metric-item">' +
            '<span class="sim-metric-label">Tiempo Estimado</span>' +
            '<strong class="sim-metric-val">' + solTime + '</strong>' +
          '</div>' +
          '<div class="sim-metric-item">' +
            '<span class="sim-metric-label">Presupuesto Referencial</span>' +
            '<strong class="sim-metric-val" style="color:var(--accent-signal);">' + solCost + '</strong>' +
          '</div>' +
        '</div>' +
        '<div style="margin-top:1.5rem; display:flex; gap:0.75rem; flex-wrap:wrap;">' +
          '<a href="pages/diagnostico.html" class="btn btn-primary btn-sm">Iniciar Diagnóstico Completo →</a>' +
          '<a href="pages/oportunidades.html" class="btn btn-secondary btn-sm">Explorar Proyectos Similares</a>' +
        '</div>' +
      '</article>';
  });
}

/* ==========================================================================
   3. CATÁLOGO DE OPORTUNIDADES Y FILTROS EN VIVO (oportunidades.html)
   ========================================================================== */
function initOpportunitiesCatalog() {
  const container = document.getElementById('opportunities-catalog-container');
  if (!container) return;

  const searchInput = document.getElementById('input-search-opportunities');
  const sectorSelect = document.getElementById('filter-sector');
  const techSelect = document.getElementById('filter-tech');
  const sortSelect = document.getElementById('filter-sort');
  const countEl = document.getElementById('catalog-results-count');

  function filterAndRender() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const sector = sectorSelect ? sectorSelect.value : 'all';
    const tech = techSelect ? techSelect.value : 'all';
    const sort = sortSelect ? sortSelect.value : 'recent';

    let list = getSolicitudes();

    // Filtro por texto
    if (query) {
      list = list.filter(function(item) {
        const text = (item.nombreNegocio + ' ' + item.titulo + ' ' + item.problemaPrincipal + ' ' + item.ciudad).toLowerCase();
        return text.indexOf(query) !== -1;
      });
    }

    // Filtro por sector
    if (sector !== 'all') {
      list = list.filter(function(item) {
        return item.sector === sector;
      });
    }

    // Filtro por tecnología
    if (tech !== 'all') {
      list = list.filter(function(item) {
        if (!item.skillsRequeridos) return false;
        return item.skillsRequeridos.some(function(s) {
          return s.toLowerCase().indexOf(tech.toLowerCase()) !== -1;
        });
      });
    }

    // Ordenamiento
    if (sort === 'budget-desc') {
      list.sort(function(a, b) {
        return (b.presupuestoNumero || 0) - (a.presupuestoNumero || 0);
      });
    } else if (sort === 'budget-asc') {
      list.sort(function(a, b) {
        return (a.presupuestoNumero || 0) - (b.presupuestoNumero || 0);
      });
    }

    // Renderizar
    container.innerHTML = '';
    if (countEl) {
      countEl.textContent = 'Mostrando ' + list.length + ' oportunidades disponibles para estudiantes';
    }

    if (list.length === 0) {
      container.innerHTML = '<p class="empty-state" style="color:var(--text-muted); padding:2rem; grid-column: 1/-1; text-align:center;">No se encontraron retos tecnológicos con los filtros seleccionados.</p>';
      return;
    }

    list.forEach(function(sol) {
      const card = document.createElement('article');
      card.className = 'opportunity-card';

      let tagsHtml = '';
      if (sol.skillsRequeridos) {
        sol.skillsRequeridos.forEach(function(tag) {
          tagsHtml += '<span class="tag">' + escapeHtml(tag) + '</span>';
        });
      }

      card.innerHTML = 
        '<div class="opp-card-header">' +
          '<span class="opp-sector-badge">' + escapeHtml(sol.sector) + '</span>' +
          '<span class="opp-budget">' + escapeHtml(sol.presupuestoEstimado) + '</span>' +
        '</div>' +
        '<h3>' + escapeHtml(sol.titulo || sol.solucionEsperada) + '</h3>' +
        '<p class="opp-company">' + escapeHtml(sol.nombreNegocio) + ' • ' + escapeHtml(sol.ciudad) + '</p>' +
        '<p class="opp-problem">' + escapeHtml(sol.problemaPrincipal) + '</p>' +
        '<div class="opp-tags">' + tagsHtml + '</div>' +
        '<div class="opp-card-footer">' +
          '<span class="opp-time">Duración: ' + escapeHtml(sol.tiempoEstimado) + '</span>' +
          '<button type="button" class="btn btn-sm btn-primary btn-view-opp" data-id="' + escapeHtml(sol.id) + '">Ver Detalle / Postularse</button>' +
        '</div>';

      const btnView = card.querySelector('.btn-view-opp');
      if (btnView) {
        btnView.addEventListener('click', function() {
          openOpportunityModal(sol);
        });
      }

      container.appendChild(card);
    });
  }

  if (searchInput) searchInput.addEventListener('input', filterAndRender);
  if (sectorSelect) sectorSelect.addEventListener('change', filterAndRender);
  if (techSelect) techSelect.addEventListener('change', filterAndRender);
  if (sortSelect) sortSelect.addEventListener('change', filterAndRender);

  // Render inicial
  filterAndRender();

  initOpportunityModal();
}

function initOpportunityModal() {
  const backdrop = document.getElementById('modal-opportunity-backdrop');
  const btnClose = document.getElementById('btn-close-opp-modal');

  if (btnClose && backdrop) {
    btnClose.addEventListener('click', function() {
      backdrop.setAttribute('hidden', 'true');
    });

    backdrop.addEventListener('click', function(event) {
      if (event.target === backdrop) {
        backdrop.setAttribute('hidden', 'true');
      }
    });
  }
}

function openOpportunityModal(sol) {
  const backdrop = document.getElementById('modal-opportunity-backdrop');
  const modalBody = document.getElementById('modal-opp-body');
  if (!backdrop || !modalBody) return;

  const currentUser = getCurrentUser();

  let tagsHtml = '';
  if (sol.skillsRequeridos) {
    sol.skillsRequeridos.forEach(function(tag) {
      tagsHtml += '<span class="tag">' + escapeHtml(tag) + '</span>';
    });
  }

  modalBody.innerHTML = 
    '<div style="margin-bottom:1.25rem;">' +
      '<span class="opp-sector-badge" style="margin-bottom:0.5rem; display:inline-block;">' + escapeHtml(sol.sector) + '</span>' +
      '<h2 id="modal-project-title" style="font-size:1.45rem; color:#FFFFFF; margin-bottom:0.25rem;">' + escapeHtml(sol.titulo || sol.solucionEsperada) + '</h2>' +
      '<p style="color:var(--text-muted); font-size:0.9rem;">Empresa: <strong>' + escapeHtml(sol.nombreNegocio) + '</strong> (' + escapeHtml(sol.ciudad) + ')</p>' +
    '</div>' +
    '<div style="margin-bottom:1.5rem;">' +
      '<h4 style="font-size:0.95rem; color:var(--accent-warm); margin-bottom:0.35rem;">Problema de la Empresa:</h4>' +
      '<p style="color:var(--text-secondary); font-size:0.95rem; line-height:1.5;">' + escapeHtml(sol.problemaPrincipal) + '</p>' +
    '</div>' +
    '<div style="margin-bottom:1.5rem;">' +
      '<h4 style="font-size:0.95rem; color:var(--accent-signal); margin-bottom:0.35rem;">Solución Esperada:</h4>' +
      '<p style="color:var(--text-secondary); font-size:0.95rem; line-height:1.5;">' + escapeHtml(sol.solucionEsperada) + '</p>' +
    '</div>' +
    '<div style="display:flex; justify-content:space-between; background-color:var(--bg-subtle); padding:1rem; border-radius:var(--radius-sm); margin-bottom:1.5rem;">' +
      '<div>' +
        '<span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Presupuesto COP</span>' +
        '<strong style="display:block; color:var(--accent-signal); font-size:1.1rem;">' + escapeHtml(sol.presupuestoEstimado) + '</strong>' +
      '</div>' +
      '<div>' +
        '<span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Duración Estimada</span>' +
        '<strong style="display:block; color:#FFFFFF; font-size:1.1rem;">' + escapeHtml(sol.tiempoEstimado) + '</strong>' +
      '</div>' +
    '</div>' +
    '<div style="margin-bottom:1.5rem;">' +
      '<h4 style="font-size:0.85rem; color:var(--text-muted); font-family:var(--font-mono); text-transform:uppercase; margin-bottom:0.5rem;">Tecnologías Requeridas:</h4>' +
      '<div style="display:flex; flex-wrap:wrap; gap:0.4rem;">' + tagsHtml + '</div>' +
    '</div>' +
    '<div style="display:flex; gap:1rem; justify-content:flex-end;">' +
      '<button type="button" class="btn btn-secondary" id="btn-modal-cancel">Cerrar</button>' +
      '<button type="button" class="btn btn-primary" id="btn-modal-apply">Postularme a esta Oportunidad</button>' +
    '</div>';

  const btnCancel = modalBody.querySelector('#btn-modal-cancel');
  if (btnCancel) {
    btnCancel.addEventListener('click', function() {
      backdrop.setAttribute('hidden', 'true');
    });
  }

  const btnApply = modalBody.querySelector('#btn-modal-apply');
  if (btnApply) {
    btnApply.addEventListener('click', function() {
      if (!currentUser || currentUser.role !== 'estudiante') {
        const goToLogin = confirm('Para postularte debes identificarte como estudiante. ¿Deseas acceder con un perfil demo de estudiante (Valentina Gómez)?');
        if (goToLogin) {
          loginWithDemo('estudiante');
        }
        return;
      }

      const nuevaConx = {
        id: 'conx-' + Date.now().toString().slice(-4),
        solicitudId: sol.id,
        empresaId: sol.empresaId,
        estudianteId: currentUser.id,
        nombreEstudiante: currentUser.name,
        nombreEmpresa: sol.nombreNegocio,
        fecha: new Date().toISOString().split('T')[0],
        estado: 'en_revision',
        mensaje: 'Postulación enviada desde catálogo público.'
      };

      saveConexion(nuevaConx);
      updateSolicitudEstado(sol.id, 'en_matching');

      btnApply.textContent = '✓ ¡Postulación Registrada!';
      btnApply.disabled = true;
      btnApply.classList.remove('btn-primary');
      btnApply.classList.add('btn-secondary');

      setTimeout(function() {
        backdrop.setAttribute('hidden', 'true');
        alert('¡Postulación enviada con éxito! ' + sol.nombreNegocio + ' podrá revisar tu perfil.');
      }, 700);
    });
  }

  backdrop.removeAttribute('hidden');
}
