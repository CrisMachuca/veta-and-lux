"use client";

import { enviarEvento } from "@/app/[locale]/lib/analytics";

const TELEFONO_TALLER = "34660800631";
const EMAIL = "info@vetandlux.com";

// Botones de contacto de la página de encargos: miden el contacto como `generate_lead` en GA4
export function EnlacesContactoEncargo({ textoWhatsapp, textoEmail, mensajeWhatsapp, asuntoEmail }: {
  textoWhatsapp: string;
  textoEmail: string;
  mensajeWhatsapp: string;
  asuntoEmail: string;
}) {
  const medir = (via: string) => enviarEvento("generate_lead", { via, origen: "lamparas_a_medida" });

  return (
    <div className="space-y-3">
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <a
        href={`https://wa.me/${TELEFONO_TALLER}?text=${encodeURIComponent(mensajeWhatsapp)}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => medir("whatsapp")}
        className="rounded-full bg-stone-900 text-stone-50 px-8 py-3 text-xs uppercase tracking-widest hover:bg-stone-800 transition-colors"
      >
        {textoWhatsapp}
      </a>
      <a
        href={`mailto:${EMAIL}?subject=${encodeURIComponent(asuntoEmail)}`}
        onClick={() => medir("email")}
        className="rounded-full border border-stone-900 text-stone-900 px-8 py-3 text-xs uppercase tracking-widest hover:bg-stone-900 hover:text-stone-50 transition-colors"
      >
        {textoEmail}
      </a>
    </div>
    <p className="text-sm text-stone-600 select-all">{EMAIL}</p>
    </div>
  );
}
