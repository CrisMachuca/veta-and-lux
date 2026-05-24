"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(
      `Consulta web — ${nombre.trim() || "Sin nombre"}`
    );
    const body = encodeURIComponent(
      `Nombre: ${nombre.trim()}\nEmail: ${email.trim()}\n\n${mensaje.trim()}`
    );
    window.location.href = `mailto:info@vetaylux.com?subject=${subject}&body=${body}`;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-stone-200/80 bg-white/80 p-6 md:p-8 shadow-sm ring-1 ring-stone-100 space-y-5"
    >
      <div>
        <label
          htmlFor="contacto-nombre"
          className="block text-xs uppercase tracking-widest text-stone-500 mb-2"
        >
          Nombre
        </label>
        <input
          id="contacto-nombre"
          name="nombre"
          type="text"
          autoComplete="name"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full rounded-lg border border-stone-200 bg-stone-50/80 px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-800/20 focus:border-stone-400"
          placeholder="Tu nombre"
        />
      </div>
      <div>
        <label
          htmlFor="contacto-email"
          className="block text-xs uppercase tracking-widest text-stone-500 mb-2"
        >
          Email
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
          placeholder="tu@email.com"
        />
      </div>
      <div>
        <label
          htmlFor="contacto-mensaje"
          className="block text-xs uppercase tracking-widest text-stone-500 mb-2"
        >
          Mensaje
        </label>
        <textarea
          id="contacto-mensaje"
          name="mensaje"
          required
          rows={5}
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          className="w-full resize-y rounded-lg border border-stone-200 bg-stone-50/80 px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-800/20 focus:border-stone-400"
          placeholder="Cuéntanos qué pieza te interesa, plazos o cualquier duda…"
        />
      </div>
      <p className="text-xs text-stone-500 leading-relaxed">
        Al enviar se abrirá tu aplicación de correo con el mensaje preparado.
        Si no ocurre nada, escríbenos directamente a{" "}
        <a
          href="mailto:info@vetaylux.com"
          className="text-stone-800 underline decoration-stone-300 hover:decoration-stone-800"
        >
          info@vetaylux.com
        </a>
        .
      </p>
      <button
        type="submit"
        className="w-full rounded-full bg-stone-900 text-stone-50 px-6 py-3 text-sm font-medium uppercase tracking-widest hover:bg-stone-800 transition-colors"
      >
        Enviar mensaje
      </button>
    </form>
  );
}
