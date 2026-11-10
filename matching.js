/**
 * CODE — Plataforma de Conexión entre MiPyMes y Talento Tecnológico
 * Archivo: js/matching.js
 * Propósito: Algoritmo determinista de afinidad técnica (%), renderizado de candidatos y retos.
 * Autores: Jared Arenas, Frederick Vargas, Jair Viloria
 */

/**
 * Algoritmo determinista de compatibilidad:
 * Compara las habilidades requeridas por el proyecto frente al stack técnico del estudiante.
 * Retorna un porcentaje entre 45% y 98%.
 */
function calculateAffinity(requiredSkills, studentSkills, availabilityHours) {
  if (!requiredSkills || requiredSkills.length === 0) {
    return 75;
  }

  if (!studentSkills || studentSkills.length === 0) {
    return 40;
  }

  const normalizedStudentSkills = studentSkills.map(function(s) {
    return s.toLowerCase().trim();
  });

  let matchCount = 0;
  for (let i = 0; i < requiredSkills.length; i++) {
    const req = requiredSkills[i].toLowerCase().trim();
    let found = false;

    for (let j = 0; j < normalizedStudentSkills.length; j++) {
      if (normalizedStudentSkills[j].indexOf(req) !== -1 || req.indexOf(normalizedStudentSkills[j]) !== -1) {
        found = true;
        break;
      }
    }
    if (found) {
      matchCount++;
    }
  }

  const matchRatio = matchCount / requiredSkills.length;
  let score = Math.round(matchRatio * 80);

  const hours = parseInt(availabilityHours, 10) || 15;
  if (hours >= 20) {
    score += 15;
  } else if (hours >= 15) {
    score += 10;
  } else {
    score += 5;
  }

  if (score > 98) score = 98;
  if (score < 45) score = 45;

  return score;
}

/**
 * Encuentra y ordena estudiantes según compatibilidad con un conjunto de habilidades requeridas.
 */
function findMatchingStudents(requiredSkills) {
  const estudiantes = getEstudiantes();
  const matched = [];

  for (let i = 0; i < estudiantes.length; i++) {
    const est = estudiantes[i];
    const affinity = calculateAffinity(requiredSkills, est.habilidades, est.disponibilidadHoras);
    matched.push({
      estudiante: est,
      affinity: affinity
    });
  }

  matched.sort(function(a, b) {
    return b.affinity - a.affinity;
  });

  return matched;
}

/**
 * Encuentra y ordena oportunidades/solicitudes según compatibilidad con el perfil del estudiante.
 */
function findMatchingOpportunities(studentSkills, availabilityHours) {
  const solicitudes = getSolicitudes();
  const matched = [];

  for (let i = 0; i < solicitudes.length; i++) {
    const sol = solicitudes[i];
    const affinity = calculateAffinity(sol.skillsRequeridos, studentSkills, availabilityHours);
    matched.push({
      solicitud: sol,
      affinity: affinity
    });
  }

  matched.sort(function(a, b) {
    return b.affinity - a.affinity;
  });

  return matched;
}

/**
 * Renderiza tarjetas visuales de candidatos compatibles en un contenedor del DOM.
 */
function renderCandidateCards(containerElement, candidateMatches, onConnectCallback) {
  if (!containerElement) return;
  containerElement.innerHTML = '';

  if (!candidateMatches || candidateMatches.length === 0) {
    containerElement.innerHTML = '<p class="empty-state" style="color: var(--text-muted); padding: 1.5rem 0;">No se encontraron candidatos disponibles en este momento.</p>';
    return;
  }

  candidateMatches.forEach(function(item) {
    const est = item.estudiante;
    const affinity = item.affinity;

    const card = document.createElement('article');
    card.className = 'candidate-card';

    let skillsBadges = '';
    for (let k = 0; k < est.habilidades.length; k++) {
      skillsBadges += '<span class="tag">' + escapeHtml(est.habilidades[k]) + '</span>';
    }

    card.innerHTML = 
      '<div class="student-match-header">' +
        '<div class="student-info">' +
          '<strong>' + escapeHtml(est.nombre) + '</strong>' +
          '<small>' + escapeHtml(est.institucion) + ' • ' + escapeHtml(est.semestre) + '</small>' +
        '</div>' +
        '<span class="match-score-badge">' + affinity + '% Match</span>' +
      '</div>' +
      '<p class="student-match-body">' + escapeHtml(est.bio || 'Estudiante enfocado en soluciones prácticas de software.') + '</p>' +
      '<div class="student-tech-tags" style="display:flex; flex-wrap:wrap; gap:0.35rem; margin-bottom:1rem;">' + skillsBadges + '</div>' +
      '<div class="student-match-footer">' +
        '<span class="student-hours">⏱ ' + est.disponibilidadHoras + ' h/sem (' + escapeHtml(est.modalidad) + ')</span>' +
        '<button type="button" class="btn btn-sm btn-primary btn-connect-candidate" data-id="' + escapeHtml(est.id) + '">' +
          'Conectar con Candidato' +
        '</button>' +
      '</div>';

    const btnConnect = card.querySelector('.btn-connect-candidate');
    if (btnConnect) {
      btnConnect.addEventListener('click', function() {
        if (typeof onConnectCallback === 'function') {
          onConnectCallback(est, btnConnect);
        } else {
          btnConnect.textContent = '✓ Conexión Solicitada';
          btnConnect.disabled = true;
          btnConnect.classList.remove('btn-primary');
          btnConnect.classList.add('btn-secondary');
        }
      });
    }

    containerElement.appendChild(card);
  });
}

/**
 * Renderiza oportunidades recomendadas para el estudiante en su panel.
 */
function renderStudentOpportunities(containerElement, opportunityMatches, onApplyCallback) {
  if (!containerElement) return;
  containerElement.innerHTML = '';

  if (!opportunityMatches || opportunityMatches.length === 0) {
    containerElement.innerHTML = '<p class="empty-state" style="color: var(--text-muted); padding: 1.5rem 0;">No hay oportunidades disponibles en este momento.</p>';
    return;
  }

  const conexiones = getConexiones();
  const currentUser = getCurrentUser();
  const currentEstudianteId = currentUser ? currentUser.id : 'est-001';

  opportunityMatches.forEach(function(item) {
    const sol = item.solicitud;
    const affinity = item.affinity;

    let alreadyApplied = false;
    for (let c = 0; c < conexiones.length; c++) {
      if (conexiones[c].solicitudId === sol.id && conexiones[c].estudianteId === currentEstudianteId) {
        alreadyApplied = true;
        break;
      }
    }

    const card = document.createElement('article');
    card.className = 'opportunity-item-card';

    let tagsHtml = '';
    if (sol.skillsRequeridos) {
      for (let t = 0; t < sol.skillsRequeridos.length; t++) {
        tagsHtml += '<span class="tag">' + escapeHtml(sol.skillsRequeridos[t]) + '</span>';
      }
    }

    const buttonHtml = alreadyApplied
      ? '<button type="button" class="btn btn-sm btn-secondary" disabled>✓ Postulado</button>'
      : '<button type="button" class="btn btn-sm btn-primary btn-apply-opp" data-id="' + escapeHtml(sol.id) + '">Postularme</button>';

    card.innerHTML = 
      '<div class="item-main-info">' +
        '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.25rem;">' +
          '<h4>' + escapeHtml(sol.titulo || sol.solucionEsperada) + '</h4>' +
          '<span class="match-score-badge">' + affinity + '% Match</span>' +
        '</div>' +
        '<p><strong>' + escapeHtml(sol.nombreNegocio) + '</strong> (' + escapeHtml(sol.sector) + ' • ' + escapeHtml(sol.ciudad) + ')</p>' +
        '<p style="margin-top:0.35rem; color: var(--text-secondary);">' + escapeHtml(sol.problemaPrincipal) + '</p>' +
        '<div class="item-meta-tags">' +
          '<span class="status-badge diagnosticado">' + escapeHtml(sol.presupuestoEstimado) + '</span>' +
          '<span class="status-badge pendiente">⏱ ' + escapeHtml(sol.tiempoEstimado) + '</span>' +
          tagsHtml +
        '</div>' +
      '</div>' +
      '<div>' + buttonHtml + '</div>';

    const btnApply = card.querySelector('.btn-apply-opp');
    if (btnApply) {
      btnApply.addEventListener('click', function() {
        if (typeof onApplyCallback === 'function') {
          onApplyCallback(sol, btnApply);
        } else {
          const nuevaConx = {
            id: 'conx-' + Date.now().toString().slice(-4),
            solicitudId: sol.id,
            empresaId: sol.empresaId,
            estudianteId: currentEstudianteId,
            nombreEstudiante: currentUser ? currentUser.name : 'Valentina Gómez',
            nombreEmpresa: sol.nombreNegocio,
            fecha: new Date().toISOString().split('T')[0],
            estado: 'en_revision',
            mensaje: 'Postulación enviada desde panel de estudiante.'
          };
          saveConexion(nuevaConx);
          updateSolicitudEstado(sol.id, 'en_matching');

          btnApply.textContent = '✓ ¡Postulado!';
          btnApply.disabled = true;
          btnApply.classList.remove('btn-primary');
          btnApply.classList.add('btn-secondary');
        }
      });
    }

    containerElement.appendChild(card);
  });
}

function escapeHtml(string) {
  if (!string) return '';
  return String(string)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
