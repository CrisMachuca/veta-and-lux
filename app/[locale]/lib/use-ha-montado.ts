import { useSyncExternalStore } from "react";

const sinSuscripcion = () => () => {};

// false en el render del servidor y en la hidratación, true después en el navegador.
// Sustituye al patrón useState(false) + useEffect(() => setX(true)), que provoca un render extra.
export function useHaMontado() {
  return useSyncExternalStore(sinSuscripcion, () => true, () => false);
}
