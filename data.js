/**
 * CODE — Plataforma de Conexión entre MiPyMes y Talento Tecnológico
 * Archivo: js/data.js
 * Propósito: Datos semilla iniciales y gestión de persistencia en LocalStorage.
 * Autores: Jared Arenas, Frederick Vargas, Jair Viloria
 */

// Constantes para las claves de LocalStorage
const STORAGE_KEYS = {
  CURRENT_USER: 'code_current_user',
  EMPRESAS: 'code_empresas',
  ESTUDIANTES: 'code_estudiantes',
  SOLICITUDES: 'code_solicitudes',
  DIAGNOSTICOS: 'code_diagnosticos',
  CONEXIONES: 'code_conexiones'
};

// Datos semilla de MiPyMes colombianas representativas
const SEED_EMPRESAS = [
  {
    id: 'emp-01',
    nombreComercial: 'Café Origen Andino',
    nit: '901.452.880-3',
    sector: 'Gastronomía',
    ciudad: 'Bogotá',
    direccion: 'Cra. 7 #72-41, Chapinero',
    contacto: 'Carlos Mendoza',
    telefono: '310 456 7890',
    email: 'contacto@cafeorigen.com',
    tamanoEquipo: '4-10',
    nivelMadurez: 'Inicial',
    puntuacionMadurez: 28,
    fechaRegistro: '2026-11-01'
  },
  {
    id: 'emp-02',
    nombreComercial: 'Calzados Bucaramanga Real',
    nit: '900.871.324-1',
    sector: 'Comercio Minorista',
    ciudad: 'Bucaramanga',
    direccion: 'Cl. 35 #19-20, Centro',
    contacto: 'Gloria Esperanza Peña',
    telefono: '315 882 1092',
    email: 'ventas@calzadosbucaramanga.co',
    tamanoEquipo: '4-10',
    nivelMadurez: 'Inicial',
    puntuacionMadurez: 32,
    fechaRegistro: '2026-11-02'
  },
  {
    id: 'emp-03',
    nombreComercial: 'Confecciones del Valle',
    nit: '901.129.544-7',
    sector: 'Manufactura',
    ciudad: 'Cali',
    direccion: 'Cl. 15 #8-33, San Nicolás',
    contacto: 'Darío Jaramillo',
    telefono: '318 765 4321',
    email: 'info@confeccionesdelvalle.com',
    tamanoEquipo: '11-30',
    nivelMadurez: 'En Transición',
    puntuacionMadurez: 45,
    fechaRegistro: '2026-10-28'
  },
  {
    id: 'emp-04',
    nombreComercial: 'Panadería La Espiga Dorada',
    nit: '800.654.321-9',
    sector: 'Gastronomía',
    ciudad: 'Medellín',
    direccion: 'Cra. 43A #1-50, El Poblado',
    contacto: 'Mariana Ochoa',
    telefono: '312 908 7766',
    email: 'contacto@laespigadorada.co',
    tamanoEquipo: '1-3',
    nivelMadurez: 'Inicial',
    puntuacionMadurez: 30,
    fechaRegistro: '2026-11-03'
  }
];

// Datos semilla de Estudiantes de tecnología con habilidades de software
const SEED_ESTUDIANTES = [
  {
    id: 'est-001',
    nombre: 'Valentina Gómez',
    institucion: 'SENA / Universidad Distrital',
    semestre: '6to Semestre',
    habilidades: ['HTML5', 'CSS3', 'JavaScript', 'Diseño UI/UX', 'Catálogos Web'],
    intereses: ['Comercio Electrónico', 'Catálogos Web', 'Accesibilidad'],
    disponibilidadHoras: 15,
    modalidad: 'Remoto',
    proyectosCompletados: 2,
    email: 'valentina@correo.edu.co',
    bio: 'Estudiante apasionada por la accesibilidad web, el diseño frontend responsivo y la usabilidad para pequeños comercios.'
  },
  {
    id: 'est-002',
    nombre: 'Santiago Robledo',
    institucion: 'Universidad de Antioquia',
    semestre: '5to Semestre',
    habilidades: ['HTML5', 'CSS3', 'JavaScript', 'Bases de Datos'],
    intereses: ['Control de Inventario', 'Sistemas Locales', 'Bases de Datos'],
    disponibilidadHoras: 20,
    modalidad: 'Remoto',
    proyectosCompletados: 1,
    email: 'santiago@udea.edu.co',
    bio: 'Enfocado en la lógica de programación frontend, persistencia con LocalStorage y optimización de inventarios locales.'
  },
  {
    id: 'est-003',
    nombre: 'Laura Camila Mora',
    institucion: 'Universidad del Valle',
    semestre: '7mo Semestre o Superior',
    habilidades: ['HTML5', 'CSS3', 'Diseño UI/UX', 'Automatización'],
    intereses: ['Vitrina Comercial', 'Cotizadores Web', 'Diseño Visual'],
    disponibilidadHoras: 15,
    modalidad: 'Semipresencial',
    proyectosCompletados: 3,
    email: 'laura.mora@univalle.edu.co',
    bio: 'Diseñadora y maquetadora frontend especializada en convertir catálogos físicos en vitrinas interactivas atractivas.'
  },
  {
    id: 'est-004',
    nombre: 'Andrés Felipe Torres',
    institucion: 'Universidad Industrial de Santander',
    semestre: 'Graduando',
    habilidades: ['HTML5', 'CSS3', 'JavaScript', 'Catálogos Web', 'Automatización'],
    intereses: ['Automatización WhatsApp', 'Integraciones Rápidas', 'Catálogos Móviles'],
    disponibilidadHoras: 25,
    modalidad: 'Remoto',
    proyectosCompletados: 4,
    email: 'andres.torres@uis.edu.co',
    bio: 'Desarrollador web con experiencia en pedidos directos a WhatsApp y flujos ágiles para microempresas sin fricciones técnicas.'
  }
];

// Solicitudes empresariales iniciales
const SEED_SOLICITUDES = [
  {
    id: 'sol-101',
    empresaId: 'emp-01',
    nombreNegocio: 'Café Origen Andino',
    sector: 'Gastronomía',
    ciudad: 'Bogotá',
    titulo: 'Catálogo web interactivo con pedidos directos a WhatsApp',
    problemaPrincipal: 'Atención manual por WhatsApp y pedidos desordenados en horas pico con pérdida de clientes recurrentes.',
    solucionEsperada: 'Menú digital interactivo donde los clientes arman su orden y se genera el mensaje estructurado de WhatsApp.',
    presupuestoEstimado: '$900.000 COP',
    presupuestoNumero: 900000,
    tiempoEstimado: '3 - 4 semanas',
    skillsRequeridos: ['HTML5', 'CSS3', 'JavaScript'],
    nivelMadurez: 'Inicial',
    fechaCreacion: '2026-11-01',
    estado: 'diagnosticado' // 'diagnosticado' | 'en_matching' | 'conectado'
  },
  {
    id: 'sol-102',
    empresaId: 'emp-02',
    nombreNegocio: 'Calzados Bucaramanga Real',
    sector: 'Comercio Minorista',
    ciudad: 'Bucaramanga',
    titulo: 'Sistema local de control de inventario y caja para zapatería',
    problemaPrincipal: 'Registro en libretas con desajustes constantes en tallas y pérdida de control sobre existencias en bodega.',
    solucionEsperada: 'Aplicación web local con registro de entradas, salidas, cálculo de existencias y reportes diarios en LocalStorage.',
    presupuestoEstimado: '$1.200.000 COP',
    presupuestoNumero: 1200000,
    tiempoEstimado: '4 - 5 semanas',
    skillsRequeridos: ['JavaScript', 'Bases de Datos', 'CSS3'],
    nivelMadurez: 'Inicial',
    fechaCreacion: '2026-11-02',
    estado: 'en_matching'
  },
  {
    id: 'sol-103',
    empresaId: 'emp-03',
    nombreNegocio: 'Confecciones del Valle',
    sector: 'Manufactura',
    ciudad: 'Cali',
    titulo: 'Vitrina web para taller de confección y cotizador de uniformes',
    problemaPrincipal: 'Clientes corporativos solicitan cotizaciones rápidas y actualmente se tardan hasta 48 horas en responder.',
    solucionEsperada: 'Página web responsive con muestrario de prendas y calculadora automática de cotizaciones según cantidad y tela.',
    presupuestoEstimado: '$800.000 COP',
    presupuestoNumero: 800000,
    tiempoEstimado: '3 semanas',
    skillsRequeridos: ['HTML5', 'CSS3', 'Diseño UI/UX'],
    nivelMadurez: 'En Transición',
    fechaCreacion: '2026-10-28',
    estado: 'conectado'
  },
  {
    id: 'sol-104',
    empresaId: 'emp-04',
    nombreNegocio: 'Panadería La Espiga Dorada',
    sector: 'Gastronomía',
    ciudad: 'Medellín',
    titulo: 'Menú digital responsive con promociones del día y geolocalización',
    problemaPrincipal: 'Menús impresos desactualizados, costos recurrentes de reimpresión y dificultad para anunciar promociones frescas.',
    solucionEsperada: 'Catálogo web ligero, actualizable desde interfaz sencilla, con mapa interactivo y botón de llamada directa.',
    presupuestoEstimado: '$750.000 COP',
    presupuestoNumero: 750000,
    tiempoEstimado: '2 a 3 semanas',
    skillsRequeridos: ['HTML5', 'CSS3', 'Catálogos Web'],
    nivelMadurez: 'Inicial',
    fechaCreacion: '2026-11-03',
    estado: 'diagnosticado'
  }
];

// Diagnósticos digitales iniciales asociados a solicitudes
const SEED_DIAGNOSTICOS = [
  {
    id: 'diag-501',
    solicitudId: 'sol-101',
    empresaId: 'emp-01',
    nombreNegocio: 'Café Origen Andino',
    sector: 'Gastronomía',
    puntuacionMadurez: 28,
    madurezDigital: 'Nivel 1: Inicial / Tradicional',
    problemasDetectados: [
      'Ausencia de catálogo digital accesible en dispositivos móviles.',
      'Sobrecarga en la toma manual de pedidos por chat de WhatsApp en horas pico.',
      'Falta de trazabilidad y consolidación de ventas diarias.'
    ],
    solucionesRecomendadas: [
      {
        titulo: 'Catálogo Digital Responsive con Pedidos a WhatsApp',
        descripcion: 'Sitio web tipo menú visual donde el usuario selecciona cafés y repostería, arma el carrito y envía la orden estructurada al WhatsApp del negocio.',
        tiempoSemanas: '3 - 4 semanas',
        costoAproximado: '$750.000 - $1.000.000 COP',
        skillsRequeridos: ['HTML5', 'CSS3', 'JavaScript']
      }
    ],
    estudiantesSugeridos: ['est-001', 'est-004'],
    fecha: '2026-11-01'
  },
  {
    id: 'diag-502',
    solicitudId: 'sol-102',
    empresaId: 'emp-02',
    nombreNegocio: 'Calzados Bucaramanga Real',
    sector: 'Comercio Minorista',
    puntuacionMadurez: 32,
    madurezDigital: 'Nivel 1: Inicial / Tradicional',
    problemasDetectados: [
      'Control manual de existencias en libretas con errores frecuentes en tallas.',
      'Falta de alerta temprana sobre productos agotados en bodega.',
      'Cierres de caja diarios lentos y propensos a diferencias de cálculo.'
    ],
    solucionesRecomendadas: [
      {
        titulo: 'Sistema Web Local de Control de Stock y Caja',
        descripcion: 'Panel web rápido para registrar ventas, descontar inventario en tiempo real y emitir resúmenes de cierre diario sin costo mensual de licencias.',
        tiempoSemanas: '4 - 5 semanas',
        costoAproximado: '$1.000.000 - $1.300.000 COP',
        skillsRequeridos: ['JavaScript', 'Bases de Datos', 'CSS3']
      }
    ],
    estudiantesSugeridos: ['est-002'],
    fecha: '2026-11-02'
  },
  {
    id: 'diag-503',
    solicitudId: 'sol-103',
    empresaId: 'emp-03',
    nombreNegocio: 'Confecciones del Valle',
    sector: 'Manufactura',
    puntuacionMadurez: 45,
    madurezDigital: 'Nivel 2: En Transición / Reactivo',
    problemasDetectados: [
      'Proceso manual y disperso para cotizar dotaciones empresariales.',
      'Demoras de hasta 48 horas en entregar propuestas formales.',
      'Poca visibilidad visual del portafolio de telas y cortes disponibles.'
    ],
    solucionesRecomendadas: [
      {
        titulo: 'Vitrina Web Institucional y Cotizador Automático',
        descripcion: 'Portal web con muestrario fotográfico de dotaciones y calculadora interactiva que estima costos al instante según volumen y tipo de confección.',
        tiempoSemanas: '3 semanas',
        costoAproximado: '$700.000 - $900.000 COP',
        skillsRequeridos: ['HTML5', 'CSS3', 'Diseño UI/UX']
      }
    ],
    estudiantesSugeridos: ['est-003', 'est-001'],
    fecha: '2026-10-28'
  },
  {
    id: 'diag-504',
    solicitudId: 'sol-104',
    empresaId: 'emp-04',
    nombreNegocio: 'Panadería La Espiga Dorada',
    sector: 'Gastronomía',
    puntuacionMadurez: 30,
    madurezDigital: 'Nivel 1: Inicial / Tradicional',
    problemasDetectados: [
      'Costos repetitivos de impresión de cartas y menús físicos.',
      'Dificultad para anunciar el pan recién horneado y ofertas matutinas.',
      'Baja presencia en búsquedas locales de mapas.'
    ],
    solucionesRecomendadas: [
      {
        titulo: 'Menú Digital Móvil con Panel de Ofertas del Día',
        descripcion: 'Página web ultraligera optimizada para escaneo QR en mesas y consulta rápida desde teléfonos móviles con botón de llamada y ubicación.',
        tiempoSemanas: '2 a 3 semanas',
        costoAproximado: '$600.000 - $850.000 COP',
        skillsRequeridos: ['HTML5', 'CSS3', 'Catálogos Web']
      }
    ],
    estudiantesSugeridos: ['est-004', 'est-001'],
    fecha: '2026-11-03'
  }
];

// Conexiones / Postulaciones iniciales
const SEED_CONEXIONES = [
  {
    id: 'conx-901',
    solicitudId: 'sol-101',
    empresaId: 'emp-01',
    estudianteId: 'est-001',
    nombreEstudiante: 'Valentina Gómez',
    nombreEmpresa: 'Café Origen Andino',
    fecha: '2026-11-02',
    estado: 'en_revision', // 'en_revision' | 'conectado' | 'finalizado'
    mensaje: 'Hola Carlos, me especializo en catálogos frontend limpios con pedidos a WhatsApp. Me encantaría desarrollar este proyecto.'
  },
  {
    id: 'conx-902',
    solicitudId: 'sol-103',
    empresaId: 'emp-03',
    estudianteId: 'est-003',
    nombreEstudiante: 'Laura Camila Mora',
    nombreEmpresa: 'Confecciones del Valle',
    fecha: '2026-10-30',
    estado: 'conectado',
    mensaje: 'Propuesta aceptada para el diseño de la vitrina web y cotizador de uniformes.'
  }
];

/**
 * Inicializa LocalStorage con datos semilla si no existen previamente.
 * Garantiza funcionamiento 100% autónomo y offline para la feria tecnológica.
 */
function initSeedData() {
  if (!localStorage.getItem(STORAGE_KEYS.EMPRESAS)) {
    localStorage.setItem(STORAGE_KEYS.EMPRESAS, JSON.stringify(SEED_EMPRESAS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ESTUDIANTES)) {
    localStorage.setItem(STORAGE_KEYS.ESTUDIANTES, JSON.stringify(SEED_ESTUDIANTES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SOLICITUDES)) {
    localStorage.setItem(STORAGE_KEYS.SOLICITUDES, JSON.stringify(SEED_SOLICITUDES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.DIAGNOSTICOS)) {
    localStorage.setItem(STORAGE_KEYS.DIAGNOSTICOS, JSON.stringify(SEED_DIAGNOSTICOS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CONEXIONES)) {
    localStorage.setItem(STORAGE_KEYS.CONEXIONES, JSON.stringify(SEED_CONEXIONES));
  }
}

/**
 * Restaura los datos semilla originales sobreescribiendo LocalStorage.
 * Permite a los jurados reiniciar la demostración en cualquier momento.
 */
function resetSeedData() {
  localStorage.setItem(STORAGE_KEYS.EMPRESAS, JSON.stringify(SEED_EMPRESAS));
  localStorage.setItem(STORAGE_KEYS.ESTUDIANTES, JSON.stringify(SEED_ESTUDIANTES));
  localStorage.setItem(STORAGE_KEYS.SOLICITUDES, JSON.stringify(SEED_SOLICITUDES));
  localStorage.setItem(STORAGE_KEYS.DIAGNOSTICOS, JSON.stringify(SEED_DIAGNOSTICOS));
  localStorage.setItem(STORAGE_KEYS.CONEXIONES, JSON.stringify(SEED_CONEXIONES));
  return true;
}

// Helpers de lectura y escritura segura en LocalStorage

function getEmpresas() {
  const data = localStorage.getItem(STORAGE_KEYS.EMPRESAS);
  return data ? JSON.parse(data) : SEED_EMPRESAS;
}

function getEstudiantes() {
  const data = localStorage.getItem(STORAGE_KEYS.ESTUDIANTES);
  return data ? JSON.parse(data) : SEED_ESTUDIANTES;
}

function getSolicitudes() {
  const data = localStorage.getItem(STORAGE_KEYS.SOLICITUDES);
  return data ? JSON.parse(data) : SEED_SOLICITUDES;
}

function getDiagnosticos() {
  const data = localStorage.getItem(STORAGE_KEYS.DIAGNOSTICOS);
  return data ? JSON.parse(data) : SEED_DIAGNOSTICOS;
}

function getConexiones() {
  const data = localStorage.getItem(STORAGE_KEYS.CONEXIONES);
  return data ? JSON.parse(data) : SEED_CONEXIONES;
}

function saveEmpresa(nuevaEmpresa) {
  const empresas = getEmpresas();
  empresas.push(nuevaEmpresa);
  localStorage.setItem(STORAGE_KEYS.EMPRESAS, JSON.stringify(empresas));
  return nuevaEmpresa;
}

function saveEstudiante(nuevoEstudiante) {
  const estudiantes = getEstudiantes();
  estudiantes.push(nuevoEstudiante);
  localStorage.setItem(STORAGE_KEYS.ESTUDIANTES, JSON.stringify(estudiantes));
  return nuevoEstudiante;
}

function updateEstudiante(id, datosActualizados) {
  const estudiantes = getEstudiantes();
  for (let i = 0; i < estudiantes.length; i++) {
    if (estudiantes[i].id === id) {
      estudiantes[i] = Object.assign({}, estudiantes[i], datosActualizados);
      break;
    }
  }
  localStorage.setItem(STORAGE_KEYS.ESTUDIANTES, JSON.stringify(estudiantes));
}

function saveSolicitud(nuevaSolicitud) {
  const solicitudes = getSolicitudes();
  solicitudes.unshift(nuevaSolicitud);
  localStorage.setItem(STORAGE_KEYS.SOLICITUDES, JSON.stringify(solicitudes));
  return nuevaSolicitud;
}

function updateSolicitudEstado(id, nuevoEstado) {
  const solicitudes = getSolicitudes();
  for (let i = 0; i < solicitudes.length; i++) {
    if (solicitudes[i].id === id) {
      solicitudes[i].estado = nuevoEstado;
      break;
    }
  }
  localStorage.setItem(STORAGE_KEYS.SOLICITUDES, JSON.stringify(solicitudes));
}

function saveDiagnostico(nuevoDiagnostico) {
  const diagnosticos = getDiagnosticos();
  diagnosticos.unshift(nuevoDiagnostico);
  localStorage.setItem(STORAGE_KEYS.DIAGNOSTICOS, JSON.stringify(diagnosticos));
  return nuevoDiagnostico;
}

function saveConexion(nuevaConexion) {
  const conexiones = getConexiones();
  conexiones.unshift(nuevaConexion);
  localStorage.setItem(STORAGE_KEYS.CONEXIONES, JSON.stringify(conexiones));
  return nuevaConexion;
}

// Inicialización preventiva
initSeedData();
