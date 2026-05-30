"use client";

import { useTranslations } from "next-intl";
import { FormEvent, useState } from "react";

export function ContactForm() {
  const t = useTranslations("ContactForm");
  
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  // Estado para controlar por dónde quiere el cliente despachar el mensaje
  const [viaContacto, setViaContacto] = useState<"email" | "whatsapp">("email");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const nombreLimpio = nombre.trim() || "Sin nombre";
    const emailLimpio = email.trim() || "No facilitado";
    const mensajeLimpio = mensaje.trim();

    if (viaContacto === "email") {
      // Flujo tradicional: Correo Electrónico
      const subject = encodeURIComponent(`Consulta web — ${nombreLimpio}`);
      const body = encodeURIComponent(
        `Nombre: ${nombreLimpio}\nEmail: ${emailLimpio}\n\n${mensajeLimpio}`
      );
      window.location.href = `mailto:info@vetandlux.com?subject=${subject}&body=${body}`;
    } else {
      // Flujo WhatsApp Directo con texto limpio
      const textoWhatsApp = encodeURIComponent(
        `🪵 *Nueva consulta desde la Web*\n\n*Nombre:* ${nombreLimpio}\n*Email:* ${emailLimpio}\n\n*Mensaje:*\n${mensajeLimpio}`
      );
      window.open(`https://wa.me/34660800631?text=${textoWhatsApp}`, "_blank");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-stone-200/80 bg-white/80 p-6 md:p-8 shadow-sm ring-1 ring-stone-100 space-y-5"
    >
      {/* Selector premium de vía de contacto */}
      <div>
        <span className="block text-xs uppercase tracking-widest text-stone-500 mb-3">
          {t("via")}
        </span>
        <div className="grid grid-cols-2 gap-2 bg-stone-100/80 p-1 rounded-xl border border-stone-200/40">
          <button
            type="button"
            onClick={() => setViaContacto("email")}
            className={`py-2 text-xs font-medium uppercase tracking-wider rounded-lg transition-all ${
              viaContacto === "email"
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            {t("emailBtn")}
          </button>
          <button
            type="button"
            onClick={() => setViaContacto("whatsapp")}
            className={`py-2 text-xs font-medium uppercase tracking-wider rounded-lg transition-all ${
              viaContacto === "whatsapp"
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            {t("wappBtn")}
          </button>
        </div>
      </div>

      {/* Inputs del formulario */}
      <div>
        <label
          htmlFor="contacto-nombre"
          className="block text-xs uppercase tracking-widest text-stone-500 mb-2"
        >
          {t("nombreLabel")}
        </label>
        <input
          id="contacto-nombre"
          name="nombre"
          type="text"
          autoComplete="name"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full rounded-lg border border-stone-200 bg-stone-50/80 px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-800/20 focus:border-stone-400"
          placeholder={t("nombrePlaceholder")}
        />
      </div>

      <div>
        <label
          htmlFor="contacto-email"
          className="block text-xs uppercase tracking-widest text-stone-500 mb-2"
        >
          {t("emailLabel")}
        </label>
        <input
          id="contacto-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-stone-200 bg-stone-50/80 px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-800/20 focus:border-stone-400"
          placeholder={t("emailPlaceholder")}
        />
      </div>

      <div>
        <label
          htmlFor="contacto-mensaje"
          className="block text-xs uppercase tracking-widest text-stone-500 mb-2"
        >
          {t("mensajeLabel")}
        </label>
        <textarea
          id="contacto-mensaje"
          name="mensaje"
          required
          rows={5}
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          className="w-full resize-y rounded-lg border border-stone-200 bg-stone-50/80 px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-800/20 focus:border-stone-400"
          placeholder={t("mensajePlaceholder")}
        />
      </div>

      {/* Nota de pie */}
      <p className="text-xs text-stone-500 leading-relaxed">
        {viaContacto === "email" ? t("pieInfo.email") : t("pieInfo.whatsapp")}
        {" "}
        {t("pieInfo.directo")}
        {" "}
        <a
          href="mailto:info@vetandlux.com"
          className="text-stone-800 underline decoration-stone-300 hover:decoration-stone-800"
        >
          info@vetandlux.com
        </a>
        .
      </p>

      {/* Botón de envío */}
      <button
        type="submit"
        className="w-full rounded-full bg-stone-900 text-stone-50 px-6 py-3 text-sm font-medium uppercase tracking-widest hover:bg-stone-800 transition-colors"
      >
        {viaContacto === "email" ? t("botonSubmit.email") : t("botonSubmit.whatsapp")}
      </button>
    </form>
  );
}