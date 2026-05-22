// --- SISTEMA DE TELEMETRÍA NATIVO ---
const Telemetria = {
  datos: {
    dispositivo: navigator.userAgent,
    instalada: false,
    tiempoPermanencia: 0,
    seccionesVisitadas: []
  },
  
  inicioSesion: Date.now(),

  init() {
    // 1. Detectar si la aplicación se abrió como PWA instalada
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      this.datos.instalada = true;
    }

    // 2. Monitorear eventos de instalación exitosa
    window.addEventListener('appinstalled', () => {
      this.datos.instalada = true;
      this.enviarServidor('INSTALACIÓN_COMPLETADA', { fecha: new Date().toISOString() });
    });

    // 3. Calcular tiempo de permanencia al cerrar o cambiar de pestaña
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.datos.tiempoPermanencia = Math.round((Date.now() - this.inicioSesion) / 1000); // en segundos
        this.enviarServidor('SESION_FINALIZADA', this.datos);
      }
    });

    // Enviar pulso inicial de actividad
    this.enviarServidor('APP_ABIERTA', { desdePWA: this.datos.instalada });
  },

  // Registrar qué módulos educativos lee el joven
  registrarLectura(seccion) {
    if (!this.datos.seccionesVisitadas.includes(seccion)) {
      this.datos.seccionesVisitadas.push(seccion);
    }
  },

  // Simulación de envío a tu endpoint / base de datos (Firebase, Railway, etc.)
  async enviarServidor(evento, payload) {
    console.log(`[KPI] Evento: ${evento}`, payload);
    /* 
    try {
      await fetch('https://tu-api.railway.app/telemetria', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ evento, payload })
      });
    } catch(e) { console.error("Error enviando KPI", e); }
    */
  }
};

window.addEventListener('DOMContentLoaded', () => Telemetria.init());
