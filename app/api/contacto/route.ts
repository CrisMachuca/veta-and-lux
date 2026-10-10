import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Formulario de contacto: envía la consulta al correo del taller con «responder a» = quien escribe.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_NOTIFICACIONES,
    pass: process.env.GMAIL_CLAVE_APLICACION,
  },
});

// Límite sencillo contra abusos: 5 envíos cada 10 minutos por IP (en memoria del proceso)
const VENTANA_MS = 10 * 60 * 1000;
const MAX_ENVIOS = 5;
const enviosPorIp = new Map<string, number[]>();

function superaLimite(ip: string) {
  const ahora = Date.now();
  const recientes = (enviosPorIp.get(ip) ?? []).filter((t) => ahora - t < VENTANA_MS);
  recientes.push(ahora);
  enviosPorIp.set(ip, recientes);
  return recientes.length > MAX_ENVIOS;
}

const escapeHtml = (texto: string) =>
  texto.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  let datos: { nombre?: unknown; email?: unknown; mensaje?: unknown; web?: unknown; locale?: unknown };
  try {
    datos = await request.json();
  } catch {
    return NextResponse.json({ error: "invalido" }, { status: 400 });
  }

  // Campo trampa: invisible para personas; si viene relleno es un bot. Se responde «ok» sin enviar nada.
  if (typeof datos.web === "string" && datos.web.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const nombre = typeof datos.nombre === "string" ? datos.nombre.trim().slice(0, 120) : "";
  const email = typeof datos.email === "string" ? datos.email.trim().slice(0, 200) : "";
  const mensaje = typeof datos.mensaje === "string" ? datos.mensaje.trim().slice(0, 5000) : "";
  const locale = datos.locale === "en" ? "en" : "es";

  if (!nombre || !EMAIL_VALIDO.test(email) || mensaje.length < 5) {
    return NextResponse.json({ error: "campos" }, { status: 400 });
  }

  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "desconocida";
  if (superaLimite(ip)) {
    return NextResponse.json({ error: "limite" }, { status: 429 });
  }

  try {
    await transporter.sendMail({
      from: `"Veta & Lux — Web" <info@vetandlux.com>`,
      to: process.env.EMAIL_NOTIFICACIONES,
      replyTo: { name: nombre, address: email },
      subject: `Consulta web — ${nombre}`,
      text: `Nombre: ${nombre}\nEmail: ${email}\nIdioma: ${locale.toUpperCase()}\n\n${mensaje}`,
      html: `
        <div style="font-family: sans-serif; color: #292524; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e7e5e4; border-radius: 12px;">
          <h2 style="margin-top: 0; font-size: 18px;">Nueva consulta desde el formulario de contacto</h2>
          <p style="margin: 0 0 6px;"><strong>Nombre:</strong> ${escapeHtml(nombre)}</p>
          <p style="margin: 0 0 6px;"><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
          <p style="margin: 0 0 16px;"><strong>Idioma:</strong> ${locale.toUpperCase()}</p>
          <div style="white-space: pre-wrap; background: #fafaf9; padding: 16px; border-radius: 8px; line-height: 1.6;">${escapeHtml(mensaje)}</div>
          <p style="font-size: 12px; color: #78716c; margin-top: 16px;">Responde a este correo para contestar directamente a ${escapeHtml(nombre)}.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("❌ Error enviando el formulario de contacto:", error);
    return NextResponse.json({ error: "envio" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
