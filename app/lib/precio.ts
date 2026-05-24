/** Convierte etiquetas tipo "230€" o "1.234,50€" a número (EUR). */
export function precioToNumber(precio: string): number {
  const normalized = precio
    .replace(/\s/g, "")
    .replace(/€/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const n = parseFloat(normalized);
  return Number.isFinite(n) ? n : 0;
}

export function formatEUR(value: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}
