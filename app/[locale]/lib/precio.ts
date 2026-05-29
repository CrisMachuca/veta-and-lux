// 1. Convierte cualquier precio (texto o número) en un número limpio para operar
export function precioToNumber(precio: string | number): number {
  if (typeof precio === "number") {
    return precio;
  }

  if (!precio) return 0;

  const normalized = precio
    .replace(/\s/g, "")
    .replace(/€/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  return parseFloat(normalized) || 0;
}

// 2. Devuelve la función que tu carrito necesita para formatear los totales
export function formatEUR(valor: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0, // Cambia a 2 si prefieres que muestre siempre los céntimos (ej: 230,00€)
  }).format(valor);
}