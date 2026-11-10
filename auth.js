/**
 * CODE — Plataforma de Conexión entre MiPyMes y Talento Tecnológico
 * Archivo: js/auth.js
 * Propósito: Gestión de sesión de demostración, validación de login/registro y barra de usuario.
 * Autores: Jared Arenas, Frederick Vargas, Jair Viloria
 */

/**
 * Obtiene el usuario autenticado actualmente desde LocalStorage.
 * Retorna null si no hay sesión activa.
 */
function getCurrentUser() {
  const user = localStorage.getItem('code_current_user');
  return user ? JSON.parse(user) : null;
}

/**
 * Guarda el usuario activo en LocalStorage.
 */
function setCurrentUser(user) {
  localStorage.setItem('code_current_user', JSON.stringify(user));
}

/**
 * Cierra la sesión activa y redirige según la ubicación actual.
 */
function logout() {
  localStorage.removeItem('code_current_user');
  const isInPagesDir = window.location.pathname.indexOf('/pages/') !== -1;
  const targetUrl = isInPagesDir ? 'login.html' : 'pages/login.html';
  window.location.href = targetUrl;
}

/**
 * Actualiza los elementos del header que reflejan la sesión del usuario.
 */
function updateSessionUI() {
  const sessionBar = document.getElementById('user-session-bar');
  const sessionUserName = document.getElementById('session-user-name');
  const navBtnLogout = document.getElementById('nav-btn-logout');
  const btnLogout = document.getElementById('btn-logout');

  const currentUser = getCurrentUser();

  if (sessionBar && sessionUserName) {
    if (currentUser) {
      sessionUserName.textContent = currentUser.name + ' (' + currentUser.role + ')';
      sessionBar.removeAttribute('hidden');
    } else {
      sessionBar.setAttribute('hidden', 'true');
    }
  }

  if (navBtnLogout) {
    navBtnLogout.addEventListener('click', function(event) {
      event.preventDefault();
      logout();
    });
  }

  if (btnLogout) {
    // Solo mostrar el botón de cerrar sesión si hay una sesión activa
    if (!currentUser) {
      btnLogout.setAttribute('hidden', 'true');
      btnLogout.style.display = 'none';
    } else {
      btnLogout.removeAttribute('hidden');
      btnLogout.style.display = '';
    }
    btnLogout.addEventListener('click', function(event) {
      event.preventDefault();
      logout();
    });
  }
}

/**
 * Inicia sesión directa con perfil de demostración para jurados de feria (1 clic).
 */
function loginWithDemo(roleType) {
  let demoUser = null;
  const isInPages = window.location.pathname.indexOf('/pages/') !== -1;

  if (roleType === 'empresa') {
    demoUser = {
      id: 'emp-01',
      name: 'Café Origen Andino',
      email: 'contacto@cafeorigen.com',
      role: 'empresa',
      city: 'Bogotá',
      sector: 'Gastronomía'
    };
    setCurrentUser(demoUser);
    window.location.href = isInPages ? 'empresa.html' : 'pages/empresa.html';
  } else if (roleType === 'estudiante') {
    demoUser = {
      id: 'est-001',
      name: 'Valentina Gómez',
      email: 'valentina@correo.edu.co',
      role: 'estudiante',
      institution: 'SENA / Universidad Distrital',
      semestre: '6to Semestre'
    };
    setCurrentUser(demoUser);
    window.location.href = isInPages ? 'estudiante.html' : 'pages/estudiante.html';
  } else if (roleType === 'admin') {
    demoUser = {
      id: 'admin-01',
      name: 'Equipo CODE',
      email: 'admin@code.org.co',
      role: 'admin',
      team: 'Jared, Frederick, Jair'
    };
    setCurrentUser(demoUser);
    window.location.href = isInPages ? 'administrador.html' : 'pages/administrador.html';
  }
}

/**
 * Configura los botones de acceso rápido demo (1 Clic) presentes en login.html
 */
function initDemoQuickAccess() {
  const demoButtons = document.querySelectorAll('.btn-demo-login');
  if (!demoButtons || demoButtons.length === 0) return;

  demoButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      const demoRole = this.getAttribute('data-demo');
      loginWithDemo(demoRole);
    });
  });
}

/**
 * Configura el selector visual de rol en login.html y registro.html
 */
function initRoleSelector() {
  const roleSelector = document.getElementById('role-selector');
  if (!roleSelector) return;

  const roleCards = roleSelector.querySelectorAll('.role-card');
  const hiddenLoginRole = document.getElementById('login-role');
  const hiddenRegisterRole = document.getElementById('register-role');
  const empresaFields = document.getElementById('empresa-fields');
  const estudianteFields = document.getElementById('estudiante-fields');

  roleCards.forEach(function(card) {
    card.addEventListener('click', function() {
      roleCards.forEach(function(c) {
        c.classList.remove('is-active');
        c.setAttribute('aria-selected', 'false');
      });

      this.classList.add('is-active');
      this.setAttribute('aria-selected', 'true');
      const selectedRole = this.getAttribute('data-role');

      if (hiddenLoginRole) {
        hiddenLoginRole.value = selectedRole;
      }

      if (hiddenRegisterRole && empresaFields && estudianteFields) {
        hiddenRegisterRole.value = selectedRole;

        if (selectedRole === 'empresa') {
          empresaFields.removeAttribute('hidden');
          estudianteFields.setAttribute('hidden', 'true');
          setFieldsetRequired(empresaFields, true);
          setFieldsetRequired(estudianteFields, false);
        } else if (selectedRole === 'estudiante') {
          empresaFields.setAttribute('hidden', 'true');
          estudianteFields.removeAttribute('hidden');
          setFieldsetRequired(empresaFields, false);
          setFieldsetRequired(estudianteFields, true);
        }
      }
    });
  });
}

function setFieldsetRequired(fieldsetElement, isRequired) {
  if (!fieldsetElement) return;
  const inputs = fieldsetElement.querySelectorAll('input:not([type="checkbox"]), select');
  inputs.forEach(function(input) {
    if (isRequired) {
      input.setAttribute('required', 'true');
    } else {
      input.removeAttribute('required');
    }
  });
}

/**
 * Inicializa y valida el formulario de inicio de sesión manual (login.html)
 */
function initLoginForm() {
  const formLogin = document.getElementById('form-login');
  if (!formLogin) return;

  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  const roleInput = document.getElementById('login-role');
  const emailError = document.getElementById('login-email-error');
  const passwordError = document.getElementById('login-password-error');
  const feedback = document.getElementById('login-feedback');

  formLogin.addEventListener('submit', function(event) {
    event.preventDefault();

    if (emailError) emailError.textContent = '';
    if (passwordError) passwordError.textContent = '';
    if (feedback) {
      feedback.textContent = '';
      feedback.className = 'form-feedback';
    }

    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value.trim() : '';
    const role = roleInput ? roleInput.value : 'empresa';

    let isValid = true;

    if (!email) {
      if (emailError) emailError.textContent = 'Por favor ingresa tu correo electrónico.';
      isValid = false;
    } else if (email.indexOf('@') === -1 || email.indexOf('.') === -1) {
      if (emailError) emailError.textContent = 'Ingresa un formato de correo válido (ej. usuario@dominio.com).';
      isValid = false;
    }

    if (!password) {
      if (passwordError) passwordError.textContent = 'Por favor ingresa tu contraseña de acceso.';
      isValid = false;
    } else if (password.length < 4) {
      if (passwordError) passwordError.textContent = 'La contraseña debe tener al menos 4 caracteres.';
      isValid = false;
    }

    if (!isValid) return;

    let matchedUser = null;
    const empresas = getEmpresas();
    const estudiantes = getEstudiantes();

    if (role === 'empresa') {
      for (let i = 0; i < empresas.length; i++) {
        if (empresas[i].email && empresas[i].email.toLowerCase() === email.toLowerCase()) {
          matchedUser = {
            id: empresas[i].id,
            name: empresas[i].nombreComercial,
            email: empresas[i].email,
            role: 'empresa',
            city: empresas[i].ciudad,
            sector: empresas[i].sector
          };
          break;
        }
      }
      if (!matchedUser) {
        matchedUser = {
          id: 'emp-demo-' + Date.now(),
          name: email.split('@')[0],
          email: email,
          role: 'empresa',
          city: 'Bogotá',
          sector: 'Gastronomía'
        };
      }
    } else if (role === 'estudiante') {
      for (let i = 0; i < estudiantes.length; i++) {
        if (estudiantes[i].email && estudiantes[i].email.toLowerCase() === email.toLowerCase()) {
          matchedUser = {
            id: estudiantes[i].id,
            name: estudiantes[i].nombre,
            email: estudiantes[i].email,
            role: 'estudiante',
            institution: estudiantes[i].institucion
          };
          break;
        }
      }
      if (!matchedUser) {
        matchedUser = {
          id: 'est-demo-' + Date.now(),
          name: email.split('@')[0],
          email: email,
          role: 'estudiante',
          institution: 'Institución Técnica / Universitaria'
        };
      }
    } else if (role === 'admin') {
      matchedUser = {
        id: 'admin-01',
        name: 'Equipo CODE',
        email: email,
        role: 'admin'
      };
    }

    setCurrentUser(matchedUser);

    if (feedback) {
      feedback.textContent = '¡Acceso concedido! Redirigiendo a tu panel...';
      feedback.className = 'form-feedback is-visible is-success';
    }

    const isInPages = window.location.pathname.indexOf('/pages/') !== -1;
    setTimeout(function() {
      if (role === 'empresa') {
        window.location.href = isInPages ? 'empresa.html' : 'pages/empresa.html';
      } else if (role === 'estudiante') {
        window.location.href = isInPages ? 'estudiante.html' : 'pages/estudiante.html';
      } else if (role === 'admin') {
        window.location.href = isInPages ? 'administrador.html' : 'pages/administrador.html';
      }
    }, 600);
  });
}

/**
 * Inicializa y valida el formulario de registro de nuevas cuentas (registro.html)
 */
function initRegisterForm() {
  const formRegister = document.getElementById('form-register');
  if (!formRegister) return;

  const roleInput = document.getElementById('register-role');
  const termsCheckbox = document.getElementById('reg-terms');
  const feedback = document.getElementById('register-feedback');

  formRegister.addEventListener('submit', function(event) {
    event.preventDefault();

    if (feedback) {
      feedback.textContent = '';
      feedback.className = 'form-feedback';
    }

    const role = roleInput ? roleInput.value : 'empresa';

    if (termsCheckbox && !termsCheckbox.checked) {
      if (feedback) {
        feedback.textContent = 'Debes aceptar los términos y el aviso de demostración académica.';
        feedback.className = 'form-feedback is-visible is-error';
      }
      termsCheckbox.focus();
      return;
    }

    let newUser = null;

    if (role === 'empresa') {
      const companyName = document.getElementById('reg-company-name').value.trim();
      const nit = document.getElementById('reg-company-nit').value.trim();
      const sector = document.getElementById('reg-company-sector').value;
      const city = document.getElementById('reg-company-city').value;
      const contact = document.getElementById('reg-company-contact').value.trim();
      const phone = document.getElementById('reg-company-phone').value.trim();
      const email = document.getElementById('reg-company-email').value.trim();
      const password = document.getElementById('reg-company-password').value.trim();

      if (!companyName || !nit || !sector || !city || !contact || !phone || !email || !password) {
        if (feedback) {
          feedback.textContent = 'Por favor completa todos los campos obligatorios de la empresa.';
          feedback.className = 'form-feedback is-visible is-error';
        }
        return;
      }

      if (password.length < 6) {
        if (feedback) {
          feedback.textContent = 'La contraseña debe tener al menos 6 caracteres.';
          feedback.className = 'form-feedback is-visible is-error';
        }
        return;
      }

      const nuevaEmpresa = {
        id: 'emp-' + Date.now().toString().slice(-4),
        nombreComercial: companyName,
        nit: nit,
        sector: sector,
        ciudad: city,
        contacto: contact,
        telefono: phone,
        email: email,
        tamanoEquipo: '1-3',
        nivelMadurez: 'Inicial',
        puntuacionMadurez: 25,
        fechaRegistro: new Date().toISOString().split('T')[0]
      };

      saveEmpresa(nuevaEmpresa);

      newUser = {
        id: nuevaEmpresa.id,
        name: nuevaEmpresa.nombreComercial,
        email: nuevaEmpresa.email,
        role: 'empresa',
        city: nuevaEmpresa.ciudad,
        sector: nuevaEmpresa.sector
      };

    } else if (role === 'estudiante') {
      const studentName = document.getElementById('reg-student-name').value.trim();
      const institution = document.getElementById('reg-student-institution').value.trim();
      const semester = document.getElementById('reg-student-semester').value;
      const hours = parseInt(document.getElementById('reg-student-hours').value, 10) || 15;
      const modality = document.getElementById('reg-student-modality').value;
      const email = document.getElementById('reg-student-email').value.trim();
      const password = document.getElementById('reg-student-password').value.trim();
      const bio = document.getElementById('reg-student-bio').value.trim();

      const skillCheckboxes = document.querySelectorAll('#reg-student-skills-grid input[type="checkbox"]:checked');
      const selectedSkills = [];
      skillCheckboxes.forEach(function(cb) {
        selectedSkills.push(cb.value);
      });

      if (!studentName || !institution || !semester || !email || !password) {
        if (feedback) {
          feedback.textContent = 'Por favor completa todos los campos requeridos del estudiante.';
          feedback.className = 'form-feedback is-visible is-error';
        }
        return;
      }

      if (selectedSkills.length === 0) {
        if (feedback) {
          feedback.textContent = 'Selecciona al menos una habilidad técnica que domines.';
          feedback.className = 'form-feedback is-visible is-error';
        }
        return;
      }

      if (password.length < 6) {
        if (feedback) {
          feedback.textContent = 'La contraseña debe tener al menos 6 caracteres.';
          feedback.className = 'form-feedback is-visible is-error';
        }
        return;
      }

      const nuevoEstudiante = {
        id: 'est-' + Date.now().toString().slice(-4),
        nombre: studentName,
        institucion: institution,
        semestre: semester,
        habilidades: selectedSkills,
        intereses: ['Digitalización', 'Web', 'Proyectos Reales'],
        disponibilidadHoras: hours,
        modalidad: modality,
        proyectosCompletados: 0,
        email: email,
        bio: bio || 'Estudiante entusiasmado por aportar valor tecnológico a pequeñas empresas.'
      };

      saveEstudiante(nuevoEstudiante);

      newUser = {
        id: nuevoEstudiante.id,
        name: nuevoEstudiante.nombre,
        email: nuevoEstudiante.email,
        role: 'estudiante',
        institution: nuevoEstudiante.institucion
      };
    }

    if (newUser) {
      setCurrentUser(newUser);

      if (feedback) {
        feedback.textContent = '¡Registro completado con éxito! Entrando a la plataforma...';
        feedback.className = 'form-feedback is-visible is-success';
      }

      const isInPages = window.location.pathname.indexOf('/pages/') !== -1;
      setTimeout(function() {
        if (role === 'empresa') {
          window.location.href = isInPages ? 'empresa.html' : 'pages/empresa.html';
        } else {
          window.location.href = isInPages ? 'estudiante.html' : 'pages/estudiante.html';
        }
      }, 700);
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  updateSessionUI();
  initDemoQuickAccess();
  initRoleSelector();
  initLoginForm();
  initRegisterForm();
});
