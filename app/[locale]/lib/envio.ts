// Tarifas de envío compartidas entre el carrito (cliente) y /api/checkout (servidor).
// El servidor nunca se fía del coste que envía el navegador: lo recalcula con esta tabla.
export const COSTES_ENVIO = { peninsula: 0, islas: 25, internacional: 65 } as const;

export type RegionEnvio = keyof typeof COSTES_ENVIO;

export function esRegionEnvio(valor: unknown): valor is RegionEnvio {
  return typeof valor === "string" && valor in COSTES_ENVIO;
}
