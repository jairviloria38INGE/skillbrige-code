/**
 * CODE — Plataforma de Conexión entre MiPyMes y Talento Tecnológico
 * Archivo: js/diagnostico.js
 * Propósito: Asistente interactivo de 4 pasos, cálculo de madurez, tiempos, presupuestos y matching.
 * Autores: Jared Arenas, Frederick Vargas, Jair Viloria
 */

let currentDiagnosticStep = 1;
const TOTAL_DIAGNOSTIC_STEPS = 4;
let lastGeneratedDiagnostic = null;

function initDiagnosticWizard() {
  const wizardContainer = document.getElementById('diagnostic-wizard');
  if (!wizardContainer) return;

  const btnNext = document.getElementById('btn-wizard-next');
  const btnPrev = document.getElementById('btn-wizard-prev');
  const btnSubmit = document.getElementById('btn-wizard-submit');
  const formDiagnostic = document.getElementById('form-diagnostic');

  precargarDatosEmpresa();

  if (btnNext) {
    btnNext.addEventListener('click', function() {
      if (validateCurrentStep(currentDiagnosticStep)) {
        if (currentDiagnosticStep < TOTAL_DIAGNOSTIC_STEPS) {
          goToStep(currentDiagnosticStep + 1);
        }
      }
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', function() {
      if (currentDiagnosticStep > 1) {
        goToStep(currentDiagnosticStep - 1);
      }
    });
  }

  if (formDiagnostic) {
    formDiagnostic.addEventListener('submit', function(event) {
      event.preventDefault();
      if (validateCurrentStep(currentDiagnosticStep)) {
        processDiagnosticCalculation();
      }
    });
  }

  const btnRestart = document.getElementById('btn-restart-diagnostic');
  if (btnRestart) {
    btnRestart.addEventListener('click', function() {
      restartDiagnostic();
    });
  }

  const btnSaveDiag = document.getElementById('btn-save-diagnostic');
  if (btnSaveDiag) {
    btnSaveDiag.addEventListener('click', function() {
      saveDiagnosticToCompany();
    });
  }
}

function precargarDatosEmpresa() {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== 'empresa') return;

  const inputName = document.getElementById('diag-business-name');
  const selectSector = document.getElementById('diag-business-sector');
  const selectCity = document.getElementById('diag-business-city');

  if (inputName && !inputName.value) {
    inputName.value = currentUser.name || '';
  }
  if (selectCity && currentUser.city) {
    selectCity.value = currentUser.city;
  }
  if (selectSector && currentUser.sector) {
    selectSector.value = currentUser.sector;
  }
}

function validateCurrentStep(stepNumber) {
  const currentStepElement = document.getElementById('step-' + stepNumber);
  const feedback = document.getElementById('wizard-feedback');

  if (!currentStepElement) return true;

  if (feedback) {
    feedback.textContent = '';
    feedback.className = 'form-feedback';
  }

  let isValid = true;
  const requiredInputs = currentStepElement.querySelectorAll('input[required], select[required]');

  requiredInputs.forEach(function(input) {
    input.style.borderColor = '';
    if (!input.value || input.value.trim() === '') {
      isValid = false;
      input.style.borderColor = 'var(--accent-danger)';
    }
  });

  if (!isValid && feedback) {
    feedback.textContent = 'Por favor completa todos los campos requeridos marcados con * antes de avanzar.';
    feedback.className = 'form-feedback is-visible is-error';
  }

  return isValid;
}

function goToStep(targetStep) {
  for (let i = 1; i <= TOTAL_DIAGNOSTIC_STEPS; i++) {
    const stepEl = document.getElementById('step-' + i);
    const stepperItem = document.getElementById('stepper-step-' + i);

    if (stepEl) {
      if (i === targetStep) {
        stepEl.classList.add('is-visible');
        stepEl.removeAttribute('hidden');
      } else {
        stepEl.classList.remove('is-visible');
        stepEl.setAttribute('hidden', 'true');
      }
    }

    if (stepperItem) {
      stepperItem.classList.remove('is-active', 'is-completed');
      if (i === targetStep) {
        stepperItem.classList.add('is-active');
      } else if (i < targetStep) {
        stepperItem.classList.add('is-completed');
      }
    }
  }

  currentDiagnosticStep = targetStep;

  const btnPrev = document.getElementById('btn-wizard-prev');
  const btnNext = document.getElementById('btn-wizard-next');
  const btnSubmit = document.getElementById('btn-wizard-submit');

  if (btnPrev) {
    btnPrev.disabled = (currentDiagnosticStep === 1);
  }

  if (currentDiagnosticStep === TOTAL_DIAGNOSTIC_STEPS) {
    if (btnNext) btnNext.setAttribute('hidden', 'true');
    if (btnSubmit) btnSubmit.removeAttribute('hidden');
  } else {
    if (btnNext) btnNext.removeAttribute('hidden');
    if (btnSubmit) btnSubmit.setAttribute('hidden', 'true');
  }
}

function processDiagnosticCalculation() {
  const formDiagnostic = document.getElementById('form-diagnostic');
  const wizardStepper = document.getElementById('wizard-stepper');
  const processingScreen = document.getElementById('diagnosis-processing');
  const resultsScreen = document.getElementById('diagnosis-results');
  const statusText = document.getElementById('processing-status-text');

  if (formDiagnostic) formDiagnostic.setAttribute('hidden', 'true');
  if (wizardStepper) wizardStepper.setAttribute('hidden', 'true');
  if (processingScreen) processingScreen.removeAttribute('hidden');

  if (statusText) statusText.textContent = 'Analizando madurez digital y canales de venta...';

  setTimeout(function() {
    if (statusText) statusText.textContent = 'Calculando soluciones técnicas, tiempos y presupuestos en COP...';
  }, 900);

  setTimeout(function() {
    if (statusText) statusText.textContent = 'Emparejando estudiantes de software compatibles...';
  }, 1700);

  setTimeout(function() {
    try {
      executeDiagnosticRules();
    } catch (e) {
      console.error('Error en motor de diagnóstico:', e);
    } finally {
      if (processingScreen) processingScreen.setAttribute('hidden', 'true');
      if (resultsScreen) resultsScreen.removeAttribute('hidden');
    }
  }, 2300);
}

function executeDiagnosticRules() {
  const businessName = document.getElementById('diag-business-name').value.trim() || 'Mi Empresa';
  const sector = document.getElementById('diag-business-sector').value || 'Comercio Minorista';
  const city = document.getElementById('diag-business-city').value || 'Colombia';
  const webPresence = document.getElementById('diag-web-presence').value;
  const ordersChannel = document.getElementById('diag-orders-channel').value;
  const customerRecords = document.getElementById('diag-customer-records').value;
  const paymentMethods = document.getElementById('diag-payment-methods').value;
  const primaryPain = document.getElementById('diag-primary-pain').value;
  const expectedSolution = document.getElementById('diag-expected-solution').value;
  const budgetRange = document.getElementById('diag-budget-range').value;

  let score = 0;
  if (webPresence === 'ninguna') score += 5;
  else if (webPresence === 'redes') score += 12;
  else if (webPresence === 'web_desactualizada') score += 10;
  else if (webPresence === 'catalogo_basico') score += 18;

  if (ordersChannel === 'mostrador') score += 5;
  else if (ordersChannel === 'telefono') score += 8;
  else if (ordersChannel === 'whatsapp_manual') score += 14;
  else if (ordersChannel === 'redes_mensajes') score += 12;

  if (customerRecords === 'memoria') score += 2;
  else if (customerRecords === 'libreta') score += 5;
  else if (customerRecords === 'excel') score += 15;
  else if (customerRecords === 'software_basico') score += 20;

  if (paymentMethods === 'efectivo_transferencia') score += 12;
  else if (paymentMethods === 'datafono') score += 18;
  else if (paymentMethods === 'online') score += 25;

  let maturityLabel = 'Nivel 1: Inicial / Tradicional';
  let badgeColorClass = 'badge-madurez';
  if (score > 60) {
    maturityLabel = 'Nivel 3: Digitalizado / Avanzado';
  } else if (score > 35) {
    maturityLabel = 'Nivel 2: En Transición / Reactivo';
  }

  const problemsDetected = [];
  if (webPresence === 'ninguna' || webPresence === 'web_desactualizada') {
    problemsDetected.push('Falta de presencia digital moderna y catálogo interactivo accesible desde teléfonos.');
  } else {
    problemsDetected.push('Presencia web fragmentada sin capacidad de interacción ni recepción directa de órdenes.');
  }

  if (ordersChannel === 'whatsapp_manual') {
    problemsDetected.push('Sobrecarga operativa por atención manual de pedidos repetitivos uno a uno.');
  } else if (ordersChannel === 'mostrador') {
    problemsDetected.push('Dependencia exclusiva del tráfico físico presencial limitando el crecimiento de ventas.');
  }

  if (customerRecords === 'libreta' || customerRecords === 'memoria') {
    problemsDetected.push('Riesgo crítico de pérdida de trazabilidad en ventas, inventario y retención de clientes.');
  } else {
    problemsDetected.push('Manejo manual de hojas de cálculo susceptible a desactualización y descontrol de stock.');
  }

  let recTitle = 'Catálogo Web Responsive con Pedidos Estructurados a WhatsApp';
  let recDesc = 'Sitio web tipo catálogo interactivo donde los clientes eligen productos, visualizan precios actualizados y envían su orden formateada automáticamente al WhatsApp del negocio.';
  let recTime = '3 a 4 semanas';
  let recCost = '$750.000 - $1.000.000 COP';
  let recSkills = ['HTML5', 'CSS3', 'JavaScript'];

  if (expectedSolution === 'control_inventario' || primaryPain === 'descontrol_stock') {
    recTitle = 'Sistema Web Local de Control de Inventario y Ventas';
    recDesc = 'Aplicación frontend con persistencia en LocalStorage para registrar entradas y salidas de producto, alertar sobre stock bajo y emitir resúmenes de cierre diario.';
    recTime = '4 a 5 semanas';
    recCost = '$1.000.000 - $1.300.000 COP';
    recSkills = ['JavaScript', 'Bases de Datos', 'CSS3'];
  } else if (expectedSolution === 'web_corporativa' || primaryPain === 'sin_visibilidad') {
    recTitle = 'Página Web Institucional y Vitrina Digital en Google';
    recDesc = 'Portal web de alto impacto visual, optimizado para celulares, con catálogo de servicios, georreferenciación en Google Maps y botones directos de contacto.';
    recTime = '2 a 3 semanas';
    recCost = '$600.000 - $850.000 COP';
    recSkills = ['HTML5', 'CSS3', 'Diseño UI/UX'];
  } else if (expectedSolution === 'cotizador_automatico' || primaryPain === 'cotizaciones_lentas') {
    recTitle = 'Calculadora y Cotizador Web Automático';
    recDesc = 'Módulo web donde los clientes eligen características del pedido y obtienen su cotización formal al instante con desglose transparente.';
    recTime = '3 semanas';
    recCost = '$700.000 - $950.000 COP';
    recSkills = ['HTML5', 'CSS3', 'JavaScript'];
  }

  const matchedStudents = findMatchingStudents(recSkills);

  lastGeneratedDiagnostic = {
    id: 'diag-' + Date.now().toString().slice(-4),
    businessName: businessName,
    sector: sector,
    city: city,
    score: score,
    maturityLabel: maturityLabel,
    problems: problemsDetected,
    recommendation: {
      title: recTitle,
      desc: recDesc,
      time: recTime,
      cost: recCost,
      skills: recSkills
    },
    matchedStudents: matchedStudents.slice(0, 3)
  };

  renderDiagnosticResults(lastGeneratedDiagnostic);
}

function renderDiagnosticResults(diag) {
  const resultTitle = document.getElementById('diag-business-result-title');
  const maturityBadge = document.getElementById('diag-maturity-badge');
  const scoreBar = document.getElementById('diag-score-bar');
  const scoreValue = document.getElementById('diag-score-value');
  const summaryText = document.getElementById('diag-summary-text');
  const problemsList = document.getElementById('diag-problems-list');
  const recsContainer = document.getElementById('diag-recommendations');
  const studentsContainer = document.getElementById('diag-matched-students');

  if (resultTitle) resultTitle.textContent = 'Diagnóstico Digital: ' + diag.businessName;
  if (maturityBadge) maturityBadge.textContent = diag.maturityLabel;
  if (scoreValue) scoreValue.textContent = diag.score + ' / 100';
  if (scoreBar) {
    scoreBar.style.width = diag.score + '%';
  }

  if (summaryText) {
    summaryText.textContent = 'Tu negocio en ' + diag.city + ' (' + diag.sector + ') cuenta con un potencial inmediato de digitalización mediante soluciones ligeras y presupuestos accesibles en COP.';
  }

  if (problemsList) {
    problemsList.innerHTML = '';
    diag.problems.forEach(function(prob) {
      const li = document.createElement('li');
      li.textContent = prob;
      problemsList.appendChild(li);
    });
  }

  if (recsContainer) {
    let skillsBadges = '';
    diag.recommendation.skills.forEach(function(s) {
      skillsBadges += '<span class="tag">' + escapeHtml(s) + '</span>';
    });

    recsContainer.innerHTML = 
      '<article class="recommendation-card">' +
        '<div class="rec-header">' +
          '<h4 class="rec-title">' + escapeHtml(diag.recommendation.title) + '</h4>' +
        '</div>' +
        '<p class="rec-desc">' + escapeHtml(diag.recommendation.desc) + '</p>' +
        '<div class="rec-skills">' + skillsBadges + '</div>' +
        '<div class="rec-metrics">' +
          '<div class="rec-metric-item">' +
            '<span class="rec-metric-label">Tiempo Estimado</span>' +
            '<strong class="rec-metric-val">' + escapeHtml(diag.recommendation.time) + '</strong>' +
          '</div>' +
          '<div class="rec-metric-item">' +
            '<span class="rec-metric-label">Presupuesto Sugerido</span>' +
            '<strong class="rec-metric-val">' + escapeHtml(diag.recommendation.cost) + '</strong>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  if (studentsContainer) {
    studentsContainer.innerHTML = '';
    renderCandidateCards(studentsContainer, diag.matchedStudents, function(est, btn) {
      btn.textContent = '✓ Conexión Enviada';
      btn.disabled = true;
      btn.classList.remove('btn-primary');
      btn.classList.add('btn-secondary');

      const currentUser = getCurrentUser();
      const nuevaConx = {
        id: 'conx-' + Date.now().toString().slice(-4),
        solicitudId: 'sol-diag',
        empresaId: currentUser ? currentUser.id : 'emp-guest',
        estudianteId: est.id,
        nombreEstudiante: est.nombre,
        nombreEmpresa: diag.businessName,
        fecha: new Date().toISOString().split('T')[0],
        estado: 'en_revision',
        mensaje: 'Interés expresado tras diagnóstico digital.'
      };
      saveConexion(nuevaConx);
      alert('¡Excelente! Se ha enviado una solicitud de conexión a ' + est.nombre + ' para iniciar la conversación sobre tu proyecto.');
    });
  }
}

function saveDiagnosticToCompany() {
  if (!lastGeneratedDiagnostic) return;

  const currentUser = getCurrentUser();
  const empresaId = currentUser && currentUser.role === 'empresa' ? currentUser.id : 'emp-01';

  const nuevoDiagnosticoGuardado = {
    id: lastGeneratedDiagnostic.id,
    solicitudId: 'sol-' + Date.now().toString().slice(-4),
    empresaId: empresaId,
    nombreNegocio: lastGeneratedDiagnostic.businessName,
    sector: lastGeneratedDiagnostic.sector,
    puntuacionMadurez: lastGeneratedDiagnostic.score,
    madurezDigital: lastGeneratedDiagnostic.maturityLabel,
    problemasDetectados: lastGeneratedDiagnostic.problems,
    solucionesRecomendadas: [
      {
        titulo: lastGeneratedDiagnostic.recommendation.title,
        descripcion: lastGeneratedDiagnostic.recommendation.desc,
        tiempoSemanas: lastGeneratedDiagnostic.recommendation.time,
        costoAproximado: lastGeneratedDiagnostic.recommendation.cost,
        skillsRequeridos: lastGeneratedDiagnostic.recommendation.skills
      }
    ],
    estudiantesSugeridos: lastGeneratedDiagnostic.matchedStudents.map(function(m) { return m.estudiante.id; }),
    fecha: new Date().toISOString().split('T')[0]
  };

  saveDiagnostico(nuevoDiagnosticoGuardado);

  const nuevaSol = {
    id: nuevoDiagnosticoGuardado.solicitudId,
    empresaId: empresaId,
    nombreNegocio: lastGeneratedDiagnostic.businessName,
    sector: lastGeneratedDiagnostic.sector,
    ciudad: lastGeneratedDiagnostic.city,
    titulo: lastGeneratedDiagnostic.recommendation.title,
    problemaPrincipal: lastGeneratedDiagnostic.problems[0] || 'Necesidad de digitalización',
    solucionEsperada: lastGeneratedDiagnostic.recommendation.desc,
    presupuestoEstimado: lastGeneratedDiagnostic.recommendation.cost,
    presupuestoNumero: 850000,
    tiempoEstimado: lastGeneratedDiagnostic.recommendation.time,
    skillsRequeridos: lastGeneratedDiagnostic.recommendation.skills,
    nivelMadurez: lastGeneratedDiagnostic.maturityLabel,
    fechaCreacion: new Date().toISOString().split('T')[0],
    estado: 'diagnosticado'
  };

  saveSolicitud(nuevaSol);

  const btnSave = document.getElementById('btn-save-diagnostic');
  if (btnSave) {
    btnSave.textContent = '✓ Guardado en tu Panel';
    btnSave.disabled = true;
    btnSave.classList.remove('btn-primary');
    btnSave.classList.add('btn-secondary');
  }

  alert('¡Diagnóstico y necesidad guardados con éxito en la plataforma!');
}

function restartDiagnostic() {
  currentDiagnosticStep = 1;
  lastGeneratedDiagnostic = null;

  const formDiagnostic = document.getElementById('form-diagnostic');
  const wizardStepper = document.getElementById('wizard-stepper');
  const resultsScreen = document.getElementById('diagnosis-results');

  if (formDiagnostic) {
    formDiagnostic.reset();
    formDiagnostic.removeAttribute('hidden');
  }
  if (wizardStepper) wizardStepper.removeAttribute('hidden');
  if (resultsScreen) resultsScreen.setAttribute('hidden', 'true');

  goToStep(1);
}

document.addEventListener('DOMContentLoaded', function() {
  initDiagnosticWizard();
});
