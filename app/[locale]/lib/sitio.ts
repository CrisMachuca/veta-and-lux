// Dominio público de la web, sin dependencias de servidor (se puede importar desde componentes de cliente).
// En producción NEXT_PUBLIC_SITE_URL es el dominio real (Stripe lo usa para volver tras el pago); en local, localhost.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.vetandlux.com").replace(/\/$/, "");
