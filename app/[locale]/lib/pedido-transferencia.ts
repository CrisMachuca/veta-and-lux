// Resumen de una reserva por transferencia para la página de confirmación.
// Viaja en sessionStorage y no en la URL: el email del cliente nunca debe acabar en una URL
// (historial, servidores, Google Analytics). Dura lo que la pestaña.

export type PedidoTransferencia = { orderId: string; email: string; items: string; total: string };

const CLAVE = "vetalux-pedido-transferencia";

export function guardarPedidoTransferencia(pedido: PedidoTransferencia) {
  try {
    sessionStorage.setItem(CLAVE, JSON.stringify(pedido));
  } catch {
    // Sin sessionStorage: la confirmación muestra solo el número de pedido; el resto va por correo
  }
}

// Texto guardado tal cual (valor estable para useSyncExternalStore)
export function leerPedidoTransferenciaCrudo(): string | null {
  try {
    return sessionStorage.getItem(CLAVE);
  } catch {
    return null;
  }
}

export function interpretarPedidoTransferencia(crudo: string | null, orderId: string): PedidoTransferencia | null {
  if (!crudo) return null;
  try {
    const pedido = JSON.parse(crudo) as PedidoTransferencia;
    return pedido.orderId === orderId ? pedido : null;
  } catch {
    return null;
  }
}
