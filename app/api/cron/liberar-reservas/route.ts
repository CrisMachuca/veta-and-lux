import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import nodemailer from "nodemailer";
import { RESERVA_CADUCADA } from "@/sanity/lib/reservas";

// Devuelve a "disponible" las piezas cuya reserva por transferencia ha caducado
// y avisa al taller. La web ya las muestra como disponibles en cuanto caducan
// (ESTADO_EFECTIVO); este cron solo deja los documentos de Sanity limpios.
//
// Se llama una vez al día con una tarea programada de Hostinger (hPanel → Avanzado → Cron Jobs):
//   curl -s -H "Authorization: Bearer <CRON_SECRET>" https://www.vetandlux.com/api/cron/liberar-reservas

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-03-25",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_NOTIFICACIONES,
    pass: process.env.GMAIL_CLAVE_APLICACION,
  },
});

type PiezaCaducada = {
  _id: string;
  _rev: string;
  nombre?: { es?: string };
  pedidoReserva?: string;
  reservadoHasta: string;
};

export async function GET(request: Request) {
  const secreto = process.env.CRON_SECRET;
  if (!secreto || request.headers.get("authorization") !== `Bearer ${secreto}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const caducadas: PiezaCaducada[] = await writeClient.fetch(
    `*[_type == "producto" && ${RESERVA_CADUCADA}]{ _id, _rev, nombre, pedidoReserva, reservadoHasta }`
  );

  if (caducadas.length === 0) {
    return NextResponse.json({ liberadas: 0 });
  }

  // ifRevisionID: si alguien ha cambiado la pieza mientras tanto (p. ej. la has marcado
  // como vendida a mano), no la pisamos.
  const liberadas: PiezaCaducada[] = [];
  for (const pieza of caducadas) {
    try {
      await writeClient
        .patch(pieza._id)
        .ifRevisionId(pieza._rev)
        .set({ estado: "disponible" })
        .unset(["reservadoHasta", "pedidoReserva"])
        .commit();
      liberadas.push(pieza);
    } catch (error) {
      console.error(`❌ No se pudo liberar la reserva de ${pieza._id}:`, error);
    }
  }

  if (liberadas.length > 0) {
    const filas = liberadas
      .map((p) => `<li style="margin-bottom: 6px;"><strong>${p.nombre?.es || p._id}</strong> — pedido ${p.pedidoReserva || "sin número"}</li>`)
      .join("");

    await transporter.sendMail({
      from: `"Veta & Lux — Tienda" <info@vetandlux.com>`,
      to: process.env.EMAIL_NOTIFICACIONES,
      subject: `⏳ ${liberadas.length} reserva(s) caducada(s): piezas de nuevo disponibles`,
      html: `
        <div style="font-family: sans-serif; color: #292524; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e7e5e4; border-radius: 16px; background-color: #fafaf9;">
          <h2 style="font-size: 20px; margin-top: 0;">Reservas liberadas</h2>
          <p style="font-size: 14px; line-height: 1.6; color: #44403c;">
            No ha llegado la transferencia a tiempo, así que estas piezas vuelven a estar a la venta:
          </p>
          <ul style="font-size: 14px; color: #44403c;">${filas}</ul>
          <p style="font-size: 13px; color: #78716c;">
            Si la transferencia llega más tarde, comprueba que la pieza no se haya vendido a otra persona antes de confirmarla.
          </p>
        </div>
      `,
    });
  }

  return NextResponse.json({ liberadas: liberadas.length });
}
