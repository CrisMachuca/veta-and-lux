"use client";

import { useLocale, useTranslations } from "next-intl";
import { FormEvent, useState } from "react";
import { Link } from "@/navigation";
import { enviarEvento } from "@/app/[locale]/lib/analytics";

type Estado = "inicial" | "enviando" | "enviado" | "error";

const claseCampo = "w-full rounded-lg border border-stone-300 bg-stone-50/80 px-4 py-3 text-stone-900 placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-800/20 focus:border-stone-500";
const claseEtiqueta = "block text-xs uppercase tracking-widest text-stone-600 mb-2";

export function ContactForm() {
  const t = useTranslations("ContactForm");
  const locale = useLocale();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [web, setWeb] = useState(""); // campo trampa para bots (oculto)
  // Estado para controlar por dónde quiere el cliente despachar el mensaje
  const [viaContacto, setViaContacto] = useState<"email" | "whatsapp">("email");
  const [estado, setEstado] = useState<Estado>("inicial");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const nombreLimpio = nombre.trim() || "Sin nombre";
    const emailLimpio = email.trim() || "No facilitado";
    const mensajeLimpio = mensaje.trim();

    if (viaContacto === "whatsapp") {
      enviarEvento("generate_lead", { via: "whatsapp", origen: "contacto" });
      // Flujo WhatsApp Directo con texto limpio
      const textoWhatsApp = encodeURIComponent(
        `🪵 *Nueva consulta desde la Web*\n\n*Nombre:* ${nombreLimpio}\n*Email:* ${emailLimpio}\n\n*Mensaje:*\n${mensajeLimpio}`
      );
      window.open(`https://wa.me/34660800631?text=${textoWhatsApp}`, "_blank");
      return;
    }

    // Email: se envía desde la web, sin depender de la aplicación de correo del visitante
    setEstado("enviando");
    try {
      const respuesta = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, mensaje, web, locale }),
      });
      if (!respuesta.ok) throw new Error(String(respuesta.status));
      enviarEvento("generate_lead", { via: "formulario", origen: "contacto" });
      setEstado("enviado");
      setNombre("");
      setEmail("");
      setMensaje("");
    } catch {
      setEstado("error");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-stone-200/80 bg-white/80 p-6 md:p-8 shadow-sm ring-1 ring-stone-100 space-y-5"
    >
      {/* Selector premium de vía de contacto */}
      <div>
        <span className="block text-xs uppercase tracking-widest text-stone-600 mb-3">
          {t("via")}
        </span>
        <div className="grid grid-cols-2 gap-2 bg-stone-100/80 p-1 rounded-xl border border-stone-200/40">
          <button
            type="button"
            onClick={() => { setViaContacto("email"); setEstado("inicial"); }}
            aria-pressed={viaContacto === "email"}
            className={`py-2 text-xs font-medium uppercase tracking-wider rounded-lg transition-all ${
              viaContacto === "email"
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            {t("emailBtn")}
          </button>
          <button
            type="button"
            onClick={() => { setViaContacto("whatsapp"); setEstado("inicial"); }}
            aria-pressed={viaContacto === "whatsapp"}
            className={`py-2 text-xs font-medium uppercase tracking-wider rounded-lg transition-all ${
              viaContacto === "whatsapp"
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            {t("wappBtn")}
          </button>
        </div>
      </div>

      {/* Inputs del formulario */}
      <div>
        <label htmlFor="contacto-nombre" className={claseEtiqueta}>{t("nombreLabel")}</label>
        <input
          id="contacto-nombre"
          name="nombre"
          type="text"
          autoComplete="name"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className={claseCampo}
          placeholder={t("nombrePlaceholder")}
        />
      </div>

      <div>
        <label htmlFor="contacto-email" className={claseEtiqueta}>{t("emailLabel")}</label>
        <input
          id="contacto-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={claseCampo}
          placeholder={t("emailPlaceholder")}
        />
      </div>

      <div>
        <label htmlFor="contacto-mensaje" className={claseEtiqueta}>{t("mensajeLabel")}</label>
        <textarea
          id="contacto-mensaje"
          name="mensaje"
          required
          minLength={5}
          rows={5}
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          className={`${claseCampo} resize-y`}
          placeholder={t("mensajePlaceholder")}
        />
      </div>

      {/* Campo trampa: oculto a personas y lectores de pantalla; los bots suelen rellenarlo */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="contacto-web">Web</label>
        <input id="contacto-web" name="web" type="text" tabIndex={-1} autoComplete="off" value={web} onChange={(e) => setWeb(e.target.value)} />
      </div>

      {/* Nota de pie */}
      <p className="text-xs text-stone-600 leading-relaxed">
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
      <p className="text-xs text-stone-600 leading-relaxed">
        {t.rich("privacidad", {
          enlace: (c) => <Link href="/politica-privacidad" className="underline underline-offset-2 hover:text-stone-900">{c}</Link>,
        })}
      </p>

      {/* Resultado del envío */}
      <div aria-live="polite">
        {estado === "enviado" && (
          <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900">{t("estado.enviado")}</p>
        )}
        {estado === "error" && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">{t("estado.error")}</p>
        )}
      </div>

      {/* Botón de envío */}
      <button
        type="submit"
        disabled={estado === "enviando"}
        className="w-full rounded-full bg-stone-900 text-stone-50 px-6 py-3 text-sm font-medium uppercase tracking-widest hover:bg-stone-800 transition-colors disabled:opacity-60"
      >
        {estado === "enviando"
          ? t("estado.enviando")
          : viaContacto === "email" ? t("botonSubmit.email") : t("botonSubmit.whatsapp")}
      </button>
    </form>
  );
}
