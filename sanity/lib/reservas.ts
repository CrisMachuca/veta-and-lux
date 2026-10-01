// Reservas por transferencia: duran HORAS_RESERVA y caducan solas.
export const HORAS_RESERVA = 48;

export function fechaFinReserva(desde = new Date()) {
  return new Date(desde.getTime() + HORAS_RESERVA * 60 * 60 * 1000).toISOString();
}

// Condición GROQ: reservada por transferencia y con el plazo ya vencido.
// Las reservas puestas a mano en el Studio (sin reservadoHasta) no caducan nunca.
export const RESERVA_CADUCADA =
  `estado == "reservado" && defined(reservadoHasta) && dateTime(reservadoHasta) < dateTime(now())`;

// Proyección GROQ del estado "real": una reserva caducada se muestra como disponible
// al instante, aunque el cron todavía no haya limpiado el documento.
export const ESTADO_EFECTIVO = `"estado": select(${RESERVA_CADUCADA} => "disponible", estado)`;
