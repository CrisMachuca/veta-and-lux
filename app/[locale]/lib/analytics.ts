// Google Analytics 4 con consentimiento previo (RGPD / LSSI).
// El script de Google NO se carga hasta que el visitante acepta las cookies de análisis.

export const GA_ID = "G-TTRHXEKW53";

// Solo medimos en el dominio real: así las pruebas en localhost no ensucian las estadísticas
export function esDominioProduccion() {
  return typeof window !== "undefined" && /(^|\.)vetandlux\.com$/.test(window.location.hostname);
}

export type Consentimiento = "aceptadas" | "rechazadas";

const CLAVE = "vetalux-cookies";
// Evento para reabrir el banner desde el enlace "Configurar cookies" del pie
export const EVENTO_ABRIR_BANNER = "vetalux:configurar-cookies";
const EVENTO_CAMBIO = "vetalux:consentimiento";

export function leerConsentimiento(): Consentimiento | null {
  try {
    const valor = localStorage.getItem(CLAVE);
    return valor === "aceptadas" || valor === "rechazadas" ? valor : null;
  } catch {
    return null;
  }
}

export function guardarConsentimiento(valor: Consentimiento) {
  try {
    localStorage.setItem(CLAVE, valor);
  } catch {
    // Sin localStorage (modo privado estricto): la elección dura lo que la visita
  }
  if (valor === "rechazadas") desactivarAnalytics();
  else (window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] = false;
  window.dispatchEvent(new Event(EVENTO_CAMBIO));
}

// Para useSyncExternalStore: avisa cuando cambia la elección
export function suscribirConsentimiento(callback: () => void) {
  window.addEventListener(EVENTO_CAMBIO, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENTO_CAMBIO, callback);
    window.removeEventListener("storage", callback);
  };
}

export function abrirConfiguracionCookies() {
  window.dispatchEvent(new Event(EVENTO_ABRIR_BANNER));
}

// Si retira el consentimiento: Analytics deja de enviar datos y se borran sus cookies (_ga, _ga_XXXX)
function desactivarAnalytics() {
  (window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] = true;
  const dominios = ["", window.location.hostname, `.${window.location.hostname.replace(/^www\./, "")}`];
  document.cookie
    .split(";")
    .map((c) => c.split("=")[0].trim())
    .filter((nombre) => nombre === "_ga" || nombre.startsWith("_ga_"))
    .forEach((nombre) => {
      dominios.forEach((dominio) => {
        document.cookie = `${nombre}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${dominio ? `; domain=${dominio}` : ""}`;
      });
    });
}

// --- Eventos de comercio electrónico de GA4 ---
// gtag solo existe si el visitante ha aceptado las cookies de análisis: sin consentimiento no se envía nada.
type Gtag = (comando: "event", nombre: string, parametros?: Record<string, unknown>) => void;

export function enviarEvento(nombre: string, parametros: Record<string, unknown> = {}, intento = 0) {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (typeof gtag === "function") {
    gtag("event", nombre, parametros);
    return;
  }
  // Con consentimiento pero con gtag aún cargando (p. ej. la confirmación de compra recién abierta): reintentar unos segundos
  if (leerConsentimiento() === "aceptadas" && esDominioProduccion() && intento < 10) {
    window.setTimeout(() => enviarEvento(nombre, parametros, intento + 1), 500);
  }
}

export type ItemAnalytics = {
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
  item_category?: string;
  item_brand: "Veta & Lux";
};

export function itemAnalytics(id: string, nombre: string, precio: number, categoria?: string): ItemAnalytics {
  return { item_id: id, item_name: nombre, price: precio, quantity: 1, item_brand: "Veta & Lux", ...(categoria ? { item_category: categoria } : {}) };
}

// Pedido con tarjeta en curso: se guarda antes de ir a Stripe para poder enviar `purchase` al volver.
const CLAVE_PEDIDO = "vetalux-pedido-pendiente";
const CLAVE_ENVIADOS = "vetalux-compras-medidas";

export function guardarPedidoPendiente(pedido: { value: number; shipping: number; items: ItemAnalytics[] }) {
  try { sessionStorage.setItem(CLAVE_PEDIDO, JSON.stringify(pedido)); } catch {}
}

export function leerPedidoPendiente(): { value: number; shipping: number; items: ItemAnalytics[] } | null {
  try { return JSON.parse(sessionStorage.getItem(CLAVE_PEDIDO) || "null"); } catch { return null; }
}

// Evita duplicar una compra si se recarga o se vuelve a la página de confirmación
export function marcarCompraMedida(transactionId: string) {
  try {
    const enviados: string[] = JSON.parse(localStorage.getItem(CLAVE_ENVIADOS) || "[]");
    if (enviados.includes(transactionId)) return false;
    localStorage.setItem(CLAVE_ENVIADOS, JSON.stringify([...enviados, transactionId].slice(-20)));
    sessionStorage.removeItem(CLAVE_PEDIDO);
    return true;
  } catch {
    return true;
  }
}
