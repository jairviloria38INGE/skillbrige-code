/**
 * CODE — Plataforma de Conexión entre MiPyMes y Talento Tecnológico
 * Archivo: js/dashboard.js
 * Propósito: Controladores interactivos para paneles de Empresa, Estudiante y Administrador.
 * Autores: Jared Arenas, Frederick Vargas, Jair Viloria
 */

document.addEventListener('DOMContentLoaded', function() {
  initCompanyDashboard();
  initStudentDashboard();
  initAdminDashboard();
});

/* ==========================================================================
   1. DASHBOARD DE PEQUEÑA EMPRESA (empresa.html)
   ========================================================================== */
function initCompanyDashboard() {
  const requestsContainer = document.getElementById('company-requests-container');
  if (!requestsContainer) return;

  const currentUser = getCurrentUser();
  const currentCompanyId = currentUser && currentUser.role === 'empresa' ? currentUser.id : 'emp-01';
  const companyName = currentUser && currentUser.role === 'empresa' ? currentUser.name : 'Café Origen Andino';

  const sidebarName = document.getElementById('sidebar-company-name');
  const greetingEl = document.getElementById('user-greeting');
  if (sidebarName) sidebarName.textContent = companyName;
  if (greetingEl) {
    greetingEl.querySelector('h1').textContent = 'Bienvenido, ' + companyName;
  }

  renderCompanyMetrics(currentCompanyId);
  renderCompanyRequests(currentCompanyId);
  renderCompanyDiagnostics(currentCompanyId);
  renderCompanyCandidates(currentCompanyId);
  initNewRequestForm(currentCompanyId, companyName);
}

function renderCompanyMetrics(companyId) {
  const solicitudes = getSolicitudes().filter(function(s) {
    return s.empresaId === companyId;
  });
  const diagnosticos = getDiagnosticos().filter(function(d) {
    return d.empresaId === companyId;
  });
  const conexiones = getConexiones().filter(function(c) {
    return c.empresaId === companyId;
  });

  const statReq = document.getElementById('company-stat-requests');
  const statDiag = document.getElementById('company-stat-diagnostics');
  const statConx = document.getElementById('company-stat-connections');
  const statBudg = document.getElementById('company-stat-budget');

  if (statReq) statReq.textContent = solicitudes.length;
  if (statDiag) statDiag.textContent = diagnosticos.length;
  if (statConx) statConx.textContent = conexiones.length;

  let totalBudget = 0;
  solicitudes.forEach(function(s) {
    totalBudget += (s.presupuestoNumero || 850000);
  });
  if (statBudg) {
    statBudg.textContent = totalBudget > 0 ? '$' + totalBudget.toLocaleString('es-CO') + ' COP' : '$900.000 COP';
  }
}

function renderCompanyRequests(companyId) {
  const container = document.getElementById('company-requests-container');
  if (!container) return;

  const solicitudes = getSolicitudes().filter(function(s) {
    return s.empresaId === companyId;
  });

  if (solicitudes.length === 0) {
    container.innerHTML = '<p class="empty-state" style="color:var(--text-muted); padding:1rem 0;">Aún no has registrado solicitudes de digitalización.</p>';
    return;
  }

  container.innerHTML = '';
  solicitudes.forEach(function(sol) {
    const card = document.createElement('div');
    card.className = 'request-item-card';

    let statusText = 'Diagnosticado';
    let statusClass = 'diagnosticado';
    if (sol.estado === 'en_matching') {
      statusText = 'En Evaluación de Candidatos';
      statusClass = 'en_matching';
    } else if (sol.estado === 'conectado') {
      statusText = 'Conexión Establecida';
      statusClass = 'conectado';
    }

    card.innerHTML = 
      '<div class="item-main-info">' +
        '<h4>' + escapeHtml(sol.titulo || sol.solucionEsperada) + '</h4>' +
        '<p>' + escapeHtml(sol.problemaPrincipal) + '</p>' +
        '<div class="item-meta-tags">' +
          '<span class="status-badge ' + statusClass + '">' + statusText + '</span>' +
          '<span class="tag">Presupuesto: ' + escapeHtml(sol.presupuestoEstimado) + '</span>' +
          '<span class="tag">Tiempo: ' + escapeHtml(sol.tiempoEstimado) + '</span>' +
          '<span class="tag">Fecha: ' + escapeHtml(sol.fechaCreacion) + '</span>' +
        '</div>' +
      '</div>' +
      '<div>' +
        '<a href="oportunidades.html" class="btn btn-sm btn-secondary">Ver en Catálogo</a>' +
      '</div>';

    container.appendChild(card);
  });
}

function renderCompanyDiagnostics(companyId) {
  const container = document.getElementById('company-diagnostics-container');
  if (!container) return;

  const diagnosticos = getDiagnosticos().filter(function(d) {
    return d.empresaId === companyId;
  });

  if (diagnosticos.length === 0) {
    container.innerHTML = '<p class="empty-state" style="color:var(--text-muted); padding:1rem 0;">No se registran diagnósticos previos para esta empresa.</p>';
    return;
  }

  container.innerHTML = '';
  diagnosticos.forEach(function(diag) {
    const card = document.createElement('div');
    card.className = 'history-item-card';

    const rec = diag.solucionesRecomendadas && diag.solucionesRecomendadas[0] ? diag.solucionesRecomendadas[0] : null;

    card.innerHTML = 
      '<div class="item-main-info">' +
        '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.25rem;">' +
          '<h4>' + escapeHtml(rec ? rec.titulo : 'Diagnóstico Tecnológico') + '</h4>' +
          '<span class="badge-madurez">' + escapeHtml(diag.madurezDigital) + '</span>' +
        '</div>' +
        '<p>' + escapeHtml(rec ? rec.descripcion : 'Evaluación de digitalización.') + '</p>' +
        '<div class="item-meta-tags">' +
          '<span class="tag">Puntuación: ' + (diag.puntuacionMadurez || 30) + '/100</span>' +
          '<span class="tag">Inversión: ' + escapeHtml(rec ? rec.costoAproximado : '$800.000 COP') + '</span>' +
          '<span class="tag">Fecha: ' + escapeHtml(diag.fecha || '2026-11-03') + '</span>' +
        '</div>' +
      '</div>' +
      '<div>' +
        '<a href="diagnostico.html" class="btn btn-sm btn-primary">Nuevo Diagnóstico</a>' +
      '</div>';

    container.appendChild(card);
  });
}

function renderCompanyCandidates(companyId) {
  const container = document.getElementById('company-candidates-container');
  if (!container) return;

  const requiredSkills = ['HTML5', 'CSS3', 'JavaScript'];
  const candidates = findMatchingStudents(requiredSkills);

  renderCandidateCards(container, candidates.slice(0, 3), function(est, btn) {
    btn.textContent = '✓ Conexión Enviada';
    btn.disabled = true;
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-secondary');

    const nuevaConx = {
      id: 'conx-' + Date.now().toString().slice(-4),
      solicitudId: 'sol-101',
      empresaId: companyId,
      estudianteId: est.id,
      nombreEstudiante: est.nombre,
      nombreEmpresa: 'Café Origen Andino',
      fecha: new Date().toISOString().split('T')[0],
      estado: 'en_revision',
      mensaje: 'Invitación enviada por la empresa.'
    };
    saveConexion(nuevaConx);
    renderCompanyMetrics(companyId);
    alert('¡Invitación enviada a ' + est.nombre + '! Podrán coordinar el alcance técnico de la solución.');
  });
}

function initNewRequestForm(companyId, companyName) {
  const btnToggle = document.getElementById('btn-toggle-request-form');
  const form = document.getElementById('form-company-request');
  if (!btnToggle || !form) return;

  btnToggle.addEventListener('click', function() {
    if (form.hasAttribute('hidden')) {
      form.removeAttribute('hidden');
      btnToggle.textContent = '✕ Cerrar Formulario';
    } else {
      form.setAttribute('hidden', 'true');
      btnToggle.textContent = '+ Abrir Formulario de Solicitud';
    }
  });

  form.addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById('req-title').value.trim();
    const sector = document.getElementById('req-sector').value;
    const problem = document.getElementById('req-problem').value.trim();
    const solution = document.getElementById('req-solution').value.trim();
    const budget = document.getElementById('req-budget').value.trim();
    const deadline = document.getElementById('req-deadline').value;

    if (!title || !problem || !solution || !budget) {
      alert('Por favor completa todos los campos del requerimiento.');
      return;
    }

    const nuevaSolicitud = {
      id: 'sol-' + Date.now().toString().slice(-4),
      empresaId: companyId,
      nombreNegocio: companyName,
      sector: sector,
      ciudad: 'Bogotá',
      titulo: title,
      problemaPrincipal: problem,
      solucionEsperada: solution,
      presupuestoEstimado: budget,
      presupuestoNumero: parseInt(budget.replace(/\D/g, ''), 10) || 850000,
      tiempoEstimado: deadline,
      skillsRequeridos: ['HTML5', 'CSS3', 'JavaScript'],
      nivelMadurez: 'Inicial',
      fechaCreacion: new Date().toISOString().split('T')[0],
      estado: 'en_matching'
    };

    saveSolicitud(nuevaSolicitud);
    form.reset();
    form.setAttribute('hidden', 'true');
    btnToggle.textContent = '+ Abrir Formulario de Solicitud';

    renderCompanyMetrics(companyId);
    renderCompanyRequests(companyId);

    alert('¡Solicitud tecnológica publicada exitosamente en el catálogo de CODE!');
  });
}

/* ==========================================================================
   2. DASHBOARD DE ESTUDIANTE DE SOFTWARE (estudiante.html)
   ========================================================================== */
function initStudentDashboard() {
  const profileForm = document.getElementById('form-student-profile');
  if (!profileForm) return;

  const currentUser = getCurrentUser();
  const currentEstudianteId = currentUser && currentUser.role === 'estudiante' ? currentUser.id : 'est-001';

  let estudiante = null;
  const estudiantes = getEstudiantes();
  for (let i = 0; i < estudiantes.length; i++) {
    if (estudiantes[i].id === currentEstudianteId) {
      estudiante = estudiantes[i];
      break;
    }
  }
  if (!estudiante) estudiante = estudiantes[0];

  const sidebarName = document.getElementById('sidebar-student-name');
  const sidebarInst = document.getElementById('sidebar-student-institution');
  const greetingEl = document.getElementById('user-greeting');

  if (sidebarName) sidebarName.textContent = estudiante.nombre;
  if (sidebarInst) sidebarInst.textContent = estudiante.institucion + ' • ' + estudiante.semestre;
  if (greetingEl) {
    greetingEl.querySelector('h1').textContent = 'Hola, ' + estudiante.nombre;
  }

  loadStudentProfileForm(estudiante);
  renderStudentDashboardMetrics(estudiante);
  renderMatchedOpportunitiesForStudent(estudiante);
  renderStudentApplications(estudiante.id);
  initStudentProfileUpdate(estudiante.id);
}

function loadStudentProfileForm(est) {
  const inputName = document.getElementById('student-profile-name');
  const inputInst = document.getElementById('student-profile-institution');
  const selectSem = document.getElementById('student-profile-semester');
  const selectHours = document.getElementById('student-profile-hours');
  const selectMod = document.getElementById('student-profile-modality');
  const inputBio = document.getElementById('student-profile-bio');

  if (inputName) inputName.value = est.nombre || '';
  if (inputInst) inputInst.value = est.institucion || '';
  if (selectSem && est.semestre) selectSem.value = est.semestre;
  if (selectHours && est.disponibilidadHoras) selectHours.value = est.disponibilidadHoras;
  if (selectMod && est.modalidad) selectMod.value = est.modalidad;
  if (inputBio) inputBio.value = est.bio || '';

  const skillCheckboxes = document.querySelectorAll('#student-skills-selector input[type="checkbox"]');
  skillCheckboxes.forEach(function(cb) {
    cb.checked = (est.habilidades && est.habilidades.indexOf(cb.value) !== -1);
  });
}

function renderStudentDashboardMetrics(est) {
  const matches = findMatchingOpportunities(est.habilidades, est.disponibilidadHoras);
  const conexiones = getConexiones().filter(function(c) {
    return c.estudianteId === est.id;
  });

  const statMatches = document.getElementById('student-stat-matches');
  const statApps = document.getElementById('student-stat-applications');
  const statHours = document.getElementById('student-stat-hours');
  const statComp = document.getElementById('student-stat-completed');

  if (statMatches) statMatches.textContent = matches.length;
  if (statApps) statApps.textContent = conexiones.length;
  if (statHours) statHours.textContent = est.disponibilidadHoras + ' h/sem';
  if (statComp) statComp.textContent = est.proyectosCompletados || 0;
}

function renderMatchedOpportunitiesForStudent(est) {
  const container = document.getElementById('student-opportunities-container');
  if (!container) return;

  const matches = findMatchingOpportunities(est.habilidades, est.disponibilidadHoras);
  renderStudentOpportunities(container, matches.slice(0, 4), function(sol, btn) {
    const nuevaConx = {
      id: 'conx-' + Date.now().toString().slice(-4),
      solicitudId: sol.id,
      empresaId: sol.empresaId,
      estudianteId: est.id,
      nombreEstudiante: est.nombre,
      nombreEmpresa: sol.nombreNegocio,
      fecha: new Date().toISOString().split('T')[0],
      estado: 'en_revision',
      mensaje: 'Postulación enviada desde panel de estudiante.'
    };
    saveConexion(nuevaConx);
    updateSolicitudEstado(sol.id, 'en_matching');

    btn.textContent = '✓ ¡Postulado!';
    btn.disabled = true;
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-secondary');

    renderStudentApplications(est.id);
    renderStudentDashboardMetrics(est);
    alert('¡Te has postulado con éxito a este reto! La empresa recibirá tu perfil.');
  });
}

function renderStudentApplications(estId) {
  const container = document.getElementById('student-applications-container');
  if (!container) return;

  const conexiones = getConexiones().filter(function(c) {
    return c.estudianteId === estId;
  });

  if (conexiones.length === 0) {
    container.innerHTML = '<p class="empty-state" style="color:var(--text-muted); padding:1rem 0;">Aún no te has postulado a proyectos empresariales.</p>';
    return;
  }

  container.innerHTML = '';
  conexiones.forEach(function(conx) {
    const card = document.createElement('div');
    card.className = 'application-item-card';

    let estadoBadge = '<span class="status-badge en_matching">En Revisión</span>';
    if (conx.estado === 'conectado') {
      estadoBadge = '<span class="status-badge conectado">✓ Conexión Aceptada</span>';
    }

    card.innerHTML = 
      '<div class="item-main-info">' +
        '<h4>' + escapeHtml(conx.nombreEmpresa) + '</h4>' +
        '<p>' + escapeHtml(conx.mensaje || 'Postulación activa.') + '</p>' +
        '<div class="item-meta-tags">' +
          estadoBadge +
          '<span class="tag">Fecha: ' + escapeHtml(conx.fecha) + '</span>' +
        '</div>' +
      '</div>' +
      '<div>' +
        '<a href="oportunidades.html" class="btn btn-sm btn-secondary">Ver Proyecto</a>' +
      '</div>';

    container.appendChild(card);
  });
}

function initStudentProfileUpdate(estId) {
  const form = document.getElementById('form-student-profile');
  const feedback = document.getElementById('profile-feedback');
  if (!form) return;

  form.addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('student-profile-name').value.trim();
    const inst = document.getElementById('student-profile-institution').value.trim();
    const sem = document.getElementById('student-profile-semester').value;
    const hours = parseInt(document.getElementById('student-profile-hours').value, 10) || 15;
    const mod = document.getElementById('student-profile-modality').value;
    const bio = document.getElementById('student-profile-bio').value.trim();

    const skillCheckboxes = document.querySelectorAll('#student-skills-selector input[type="checkbox"]:checked');
    const selectedSkills = [];
    skillCheckboxes.forEach(function(cb) {
      selectedSkills.push(cb.value);
    });

    if (!name || !inst) {
      if (feedback) {
        feedback.textContent = 'El nombre y la institución son obligatorios.';
        feedback.className = 'form-feedback is-visible is-error';
      }
      return;
    }

    const updatedData = {
      nombre: name,
      institucion: inst,
      semestre: sem,
      disponibilidadHoras: hours,
      modalidad: mod,
      bio: bio,
      habilidades: selectedSkills
    };

    updateEstudiante(estId, updatedData);

    if (feedback) {
      feedback.textContent = '✓ Ficha y habilidades actualizadas. Recalculando proyectos compatibles...';
      feedback.className = 'form-feedback is-visible is-success';
    }

    const estUpdated = Object.assign({}, updatedData, { id: estId });
    renderStudentDashboardMetrics(estUpdated);
    renderMatchedOpportunitiesForStudent(estUpdated);

    setTimeout(function() {
      if (feedback) feedback.className = 'form-feedback';
    }, 3000);
  });
}

/* ==========================================================================
   3. DASHBOARD DE ADMINISTRACIÓN (administrador.html)
   ========================================================================== */
function initAdminDashboard() {
  const adminTable = document.getElementById('admin-summary-table');
  if (!adminTable) return;

  renderAdminOverviewMetrics();
  renderAdminTable('all');
  renderAdminCompaniesList();
  renderAdminStudentsList();

  const filterStatus = document.getElementById('admin-filter-status');
  if (filterStatus) {
    filterStatus.addEventListener('change', function() {
      renderAdminTable(this.value);
    });
  }

  const btnReset = document.getElementById('btn-reset-demo');
  if (btnReset) {
    btnReset.addEventListener('click', function() {
      const confirmReset = confirm('¿Deseas reiniciar los datos de demostración a su estado original para una nueva presentación ante jurados?');
      if (confirmReset) {
        resetSeedData();
        renderAdminOverviewMetrics();
        renderAdminTable('all');
        renderAdminCompaniesList();
        renderAdminStudentsList();
        alert('Datos restablecidos con éxito para una nueva demostración.');
      }
    });
  }
}

function renderAdminOverviewMetrics() {
  const empresas = getEmpresas();
  const estudiantes = getEstudiantes();
  const solicitudes = getSolicitudes();
  const conexiones = getConexiones();

  const statComp = document.getElementById('admin-stat-companies');
  const statStud = document.getElementById('admin-stat-students');
  const statReq = document.getElementById('admin-stat-requests');
  const statMatch = document.getElementById('admin-stat-matches');

  if (statComp) statComp.textContent = empresas.length;
  if (statStud) statStud.textContent = estudiantes.length;
  if (statReq) statReq.textContent = solicitudes.length;
  if (statMatch) statMatch.textContent = conexiones.length;
}

function renderAdminTable(filterStatus) {
  const tbody = document.getElementById('admin-summary-tbody');
  if (!tbody) return;

  let solicitudes = getSolicitudes();
  if (filterStatus && filterStatus !== 'all') {
    solicitudes = solicitudes.filter(function(s) {
      return s.estado === filterStatus;
    });
  }

  tbody.innerHTML = '';
  if (solicitudes.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:1.5rem; color:var(--text-muted);">No hay solicitudes con el estado seleccionado.</td></tr>';
    return;
  }

  solicitudes.forEach(function(sol) {
    const tr = document.createElement('tr');

    let badgeClass = 'diagnosticado';
    let statusLabel = 'Diagnosticado';
    if (sol.estado === 'en_matching') {
      badgeClass = 'en_matching';
      statusLabel = 'En Matching';
    } else if (sol.estado === 'conectado') {
      badgeClass = 'conectado';
      statusLabel = 'Conectado';
    }

    tr.innerHTML = 
      '<td><strong>' + escapeHtml(sol.id) + '</strong></td>' +
      '<td>' + escapeHtml(sol.nombreNegocio) + '</td>' +
      '<td>' + escapeHtml(sol.sector) + '</td>' +
      '<td>' + escapeHtml(sol.ciudad) + '</td>' +
      '<td><span class="tag">' + escapeHtml(sol.nivelMadurez || 'Inicial') + '</span></td>' +
      '<td><strong style="color:var(--accent-signal);">' + escapeHtml(sol.presupuestoEstimado) + '</strong></td>' +
      '<td><span class="status-badge ' + badgeClass + '">' + statusLabel + '</span></td>' +
      '<td><a href="oportunidades.html" class="btn btn-sm btn-secondary">Ver</a></td>';

    tbody.appendChild(tr);
  });
}

function renderAdminCompaniesList() {
  const container = document.getElementById('admin-companies-list');
  if (!container) return;

  const empresas = getEmpresas();
  container.innerHTML = '';

  empresas.forEach(function(emp) {
    const card = document.createElement('div');
    card.className = 'admin-user-card';
    card.innerHTML = 
      '<strong>' + escapeHtml(emp.nombreComercial) + '</strong>' +
      '<small>' + escapeHtml(emp.sector) + ' • ' + escapeHtml(emp.ciudad) + '</small>' +
      '<small style="color:var(--text-secondary);">Contacto: ' + escapeHtml(emp.contacto) + ' (' + escapeHtml(emp.telefono) + ')</small>' +
      '<span class="tag" style="margin-top:0.35rem; align-self:flex-start;">NIT: ' + escapeHtml(emp.nit) + '</span>';
    container.appendChild(card);
  });
}

function renderAdminStudentsList() {
  const container = document.getElementById('admin-students-list');
  if (!container) return;

  const estudiantes = getEstudiantes();
  container.innerHTML = '';

  estudiantes.forEach(function(est) {
    const card = document.createElement('div');
    card.className = 'admin-user-card';

    let skillsList = est.habilidades.slice(0, 3).join(', ');
    if (est.habilidades.length > 3) skillsList += '...';

    card.innerHTML = 
      '<strong>' + escapeHtml(est.nombre) + '</strong>' +
      '<small>' + escapeHtml(est.institucion) + ' • ' + escapeHtml(est.semestre) + '</small>' +
      '<small style="color:var(--text-secondary);">Stack: ' + escapeHtml(skillsList) + '</small>' +
      '<span class="tag" style="margin-top:0.35rem; align-self:flex-start;">' + est.disponibilidadHoras + ' h/sem (' + escapeHtml(est.modalidad) + ')</span>';
    container.appendChild(card);
  });
}
