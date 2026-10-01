import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@sanity/client";
import nodemailer from "nodemailer";
import type { CartLine } from "@/app/[locale]/components/cart-provider";
import { COSTES_ENVIO, esRegionEnvio } from "@/app/[locale]/lib/envio";
import { ESTADO_EFECTIVO, fechaFinReserva } from "@/sanity/lib/reservas";

// 1. Inicialización de Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// 2. Inicialización de Sanity con permisos de ESCRITURA
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-03-25",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false, // Falso para evitar cachés en el stock al reservar
});

// 3. Servidor de envío SMTP para las alertas de transferencia
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_NOTIFICACIONES,
    pass: process.env.GMAIL_CLAVE_APLICACION,
  },
});

// Datos bancarios para transferencias (públicos: se muestran al cliente)
const IBAN = process.env.NEXT_PUBLIC_IBAN_TRANSFERENCIA;
const TITULAR = process.env.NEXT_PUBLIC_TITULAR_CUENTA || "Veta & Lux";

type DatosCliente = {
  email?: string;
  nombre?: string;
  direccion?: {
    calle?: string;
    localidad?: string;
    codigoPostal?: string;
    regionUbicacion?: string;
    paisBase?: string;
  };
};

// Pieza tal y como está AHORA en Sanity (la única fuente de verdad para precio y estado)
type PiezaSanity = {
  _id: string;
  _rev: string;
  nombre?: { es?: string; en?: string };
  precio: number;
  estado?: "disponible" | "reservado" | "vendido";
  imagenUrl?: string;
};

type LineaStripe = NonNullable<NonNullable<Parameters<typeof stripe.checkout.sessions.create>[0]>["line_items"]>[number];

class ErrorCheckout extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

// Escapa texto del cliente antes de meterlo en el HTML de los correos
function escapeHtml(texto: string) {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const formatoEUR = (valor: number) => `${valor.toFixed(2)}€`;

// Lee las piezas del carrito en Sanity y comprueba que todas existen y siguen disponibles
async function cargarPiezasDisponibles(lines: CartLine[], locale: string) {
  const ids = [...new Set(lines.map((line) => String(line.productId)))];

  const piezas: PiezaSanity[] = await writeClient.fetch(
    `*[_type == "producto" && _id in $ids]{ _id, _rev, nombre, precio, ${ESTADO_EFECTIVO}, "imagenUrl": imagen.asset->url }`,
    { ids }
  );

  const esIngles = locale === "en";

  if (piezas.length !== ids.length) {
    throw new ErrorCheckout(
      esIngles
        ? "Some pieces in your cart no longer exist. Please review your cart."
        : "Alguna pieza de tu carrito ya no existe. Revisa el carrito, por favor.",
      409
    );
  }

  const noDisponibles = piezas.filter((p) => p.estado && p.estado !== "disponible");
  if (noDisponibles.length > 0) {
    const nombres = noDisponibles.map((p) => p.nombre?.[esIngles ? "en" : "es"] || p.nombre?.es || p._id).join(", ");
    throw new ErrorCheckout(
      esIngles
        ? `Sorry, these pieces are no longer available: ${nombres}. Please remove them from your cart.`
        : `Lo sentimos, estas piezas ya no están disponibles: ${nombres}. Quítalas del carrito para continuar.`,
      409
    );
  }

  if (piezas.some((p) => typeof p.precio !== "number" || p.precio <= 0)) {
    throw new ErrorCheckout(esIngles ? "One of the pieces has an invalid price. Please contact us." : "Una de las piezas tiene un precio no válido. Escríbenos, por favor.", 500);
  }

  return piezas;
}

export async function POST(request: Request) {
  try {
    const {
      lines,
      metodoPago,
      datosCliente,
      regionEnvio: regionRecibida = "peninsula",
      locale: localeRecibido = "es",
    }: {
      lines: CartLine[];
      metodoPago: string;
      datosCliente: DatosCliente;
      regionEnvio?: string;
      locale?: string;
    } = await request.json();

    const locale = localeRecibido === "en" ? "en" : "es";
    const esIngles = locale === "en";
    // Mensajes que ve el cliente, en su idioma
    const msg = (es: string, en: string) => (esIngles ? en : es);

    if (!Array.isArray(lines) || lines.length === 0) {
      return NextResponse.json({ error: msg("El carrito está vacío", "Your cart is empty") }, { status: 400 });
    }

    if (!esRegionEnvio(regionRecibida)) {
      return NextResponse.json({ error: msg("Región de envío no válida", "Invalid shipping region") }, { status: 400 });
    }
    const regionEnvio = regionRecibida;

    // Traducción de regiones para el bloque de correo y metadatos
    const etiquetaRegion =
      regionEnvio === "peninsula" ? "España Peninsular" :
      regionEnvio === "islas" ? "Islas, Ceuta o Melilla" : "Internacional / Europa";

    const dir = datosCliente?.direccion;
    const emailCliente = datosCliente?.email?.trim() || "";
    const nombreCliente = datosCliente?.nombre?.trim() || "Cliente";

    if (!emailCliente) {
      return NextResponse.json({ error: msg("El email es obligatorio", "Email is required") }, { status: 400 });
    }

    // Cortafuegos de seguridad global
    if (regionEnvio === "peninsula" && (dir?.paisBase === "Francia" || dir?.paisBase === "FR")) {
      return NextResponse.json(
        { error: msg("El país de destino no corresponde con la tarifa de envío elegida.", "The destination country does not match the selected shipping rate.") },
        { status: 400 }
      );
    }

    // 🔒 Precio, nombre y estado salen de Sanity, nunca del navegador.
    // Cada pieza es única: siempre se vende 1 unidad.
    const piezas = await cargarPiezasDisponibles(lines, locale);
    const nombrePieza = (p: PiezaSanity) => p.nombre?.[locale] || p.nombre?.es || "Pieza Veta & Lux";

    const costeEnvio = COSTES_ENVIO[regionEnvio];
    const subtotalPiezas = piezas.reduce((acc, p) => acc + p.precio, 0);
    const totalPedido = subtotalPiezas + costeEnvio;

    // Construcción de la dirección en formato texto legible
    const direccionCompletaTexto = `${dir?.calle || ""}, CP: ${dir?.codigoPostal || ""}, ${dir?.localidad || ""} ${dir?.regionUbicacion ? `(${dir.regionUbicacion})` : ""}, ${dir?.paisBase || ""}`;

    // ==========================================================
    // 💳 CASO A: Pago por Tarjeta (Stripe)
    // ==========================================================
    if (metodoPago === "stripe") {
      const lineItems: LineaStripe[] = piezas.map((p) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: nombrePieza(p),
            images: p.imagenUrl ? [`${p.imagenUrl}?w=600&auto=format`] : [],
          },
          unit_amount: Math.round(p.precio * 100),
        },
        quantity: 1,
      }));

      if (costeEnvio > 0) {
        lineItems.push({
          price_data: {
            currency: "eur",
            product_data: {
              name: esIngles
                ? `Insured shipping (${regionEnvio === "islas" ? "Balearic/Canary Islands, Ceuta or Melilla" : regionEnvio === "internacional" ? "International / Europe" : "Mainland Spain"})`
                : `Envío asegurado (${etiquetaRegion})`,
              description: msg("Tarifa según la dirección de entrega", "Rate based on the delivery address"),
            },
            unit_amount: Math.round(costeEnvio * 100),
          },
          quantity: 1,
        });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        customer_email: emailCliente,

        // El webhook usa estos metadatos para marcar las piezas como vendidas
        metadata: {
          productIds: piezas.map((p) => p._id).join(","),
          clientName: nombreCliente,
          clientEmail: emailCliente,
          shippingAddress: direccionCompletaTexto,
          regionEnvio: regionEnvio,
          costeEnvio: costeEnvio.toString(),
          locale: locale,
        },

        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/checkout/success?method=stripe&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/carrito`,
      });

      return NextResponse.json({ url: session.url });
    }

    // ==========================================================
    // 🏦 CASO B: Transferencia Bancaria
    // ==========================================================
    if (metodoPago === "transferencia") {
      if (!IBAN) {
        console.error("❌ Falta NEXT_PUBLIC_IBAN_TRANSFERENCIA en las variables de entorno");
        return NextResponse.json(
          {
            error: esIngles
              ? "Bank transfer is temporarily unavailable. Please pay by card or contact us."
              : "El pago por transferencia no está disponible ahora mismo. Paga con tarjeta o escríbenos.",
          },
          { status: 503 }
        );
      }

      const numeroPedido = `VL-${Date.now().toString(36).toUpperCase()}`;

      // Reserva atómica: si otra compra ha tocado alguna pieza desde que la leímos,
      // ifRevisionID hace fallar toda la transacción y no se reserva nada.
      // La reserva caduca sola pasadas 48 h (ver sanity/lib/reservas.ts y /api/cron/liberar-reservas).
      const reservadoHasta = fechaFinReserva();
      const transaccion = writeClient.transaction();
      piezas.forEach((p) =>
        transaccion.patch(p._id, { set: { estado: "reservado", reservadoHasta, pedidoReserva: numeroPedido }, ifRevisionID: p._rev })
      );
      try {
        await transaccion.commit();
      } catch (error) {
        console.error("❌ Conflicto al reservar piezas:", error);
        throw new ErrorCheckout(
          esIngles
            ? "Someone has just reserved one of these pieces. Please refresh and try again."
            : "Alguien acaba de reservar una de estas piezas. Recarga la página e inténtalo de nuevo.",
          409
        );
      }

      const resumenPiezas = piezas.map((p) => nombrePieza(p)).join(", ");
      const nombreHtml = escapeHtml(nombreCliente);
      const emailHtml = escapeHtml(emailCliente);
      const direccionHtml = escapeHtml(direccionCompletaTexto);

      const filasPiezasHtml = piezas.map((p) => `
        <tr>
          <td style="padding: 8px 0; color: #44403c; font-size: 14px;">${escapeHtml(nombrePieza(p))}</td>
          <td style="padding: 8px 0; color: #1c1917; font-size: 14px; text-align: right;">${formatoEUR(p.precio)}</td>
        </tr>
      `).join("");

      const filasTotalesHtml = (txtEnvio: string, txtTotal: string, txtGratis: string) => `
        <tr>
          <td style="padding: 8px 0; color: #78716c; font-size: 13px; border-top: 1px solid #e7e5e4;">${txtEnvio}</td>
          <td style="padding: 8px 0; color: #78716c; font-size: 13px; text-align: right; border-top: 1px solid #e7e5e4;">${costeEnvio === 0 ? txtGratis : formatoEUR(costeEnvio)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #1c1917; font-size: 16px; font-weight: bold;">${txtTotal}</td>
          <td style="padding: 8px 0; color: #1c1917; font-size: 16px; font-weight: bold; text-align: right;">${formatoEUR(totalPedido)}</td>
        </tr>
      `;

      // Correo interno para el taller
      await transporter.sendMail({
        from: `"Veta & Lux — Tienda" <info@vetandlux.com>`,
        to: process.env.EMAIL_NOTIFICACIONES,
        subject: `🚨 Nueva Reserva por Transferencia [${numeroPedido}]: ${nombrePieza(piezas[0])}`,
        html: `
          <div style="font-family: sans-serif; color: #292524; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e7e5e4; border-radius: 16px; background-color: #fafaf9;">
            <h2 style="color: #b45309; font-size: 22px; border-bottom: 1px solid #e7e5e4; padding-bottom: 15px; margin-top: 0;">
              🏦 Nueva reserva pendiente de transferencia
            </h2>
            <p style="font-size: 15px; line-height: 1.6; color: #44403c;">
              Las piezas se han marcado como <strong>reservadas</strong> en Sanity hasta el
              <strong>${new Date(reservadoHasta).toLocaleString("es-ES", { timeZone: "Europe/Madrid" })}</strong>.
              Cuando llegue el ingreso con el concepto <strong>${numeroPedido}</strong>, márcalas como vendidas.
              Si no llega a tiempo, la reserva se libera sola y las piezas vuelven a estar disponibles.
            </p>
            <table style="width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #e7e5e4; border-radius: 12px; padding: 16px; margin: 20px 0;">
              ${filasPiezasHtml}
              ${filasTotalesHtml(`Envío (${etiquetaRegion})`, "Total a recibir", "Gratis")}
            </table>
            <div style="background-color: #f5f5f4; padding: 20px; border-radius: 12px;">
              <p style="font-size: 14px; color: #57534e; margin: 0 0 10px;"><strong>Cliente:</strong> ${nombreHtml} (<a href="mailto:${emailHtml}" style="color: #78350f;">${emailHtml}</a>)</p>
              <p style="font-size: 14px; color: #57534e; margin: 0 0 10px;"><strong>Dirección de envío:</strong> ${direccionHtml}</p>
              <p style="font-size: 14px; color: #57534e; margin: 0;"><strong>Idioma:</strong> ${locale.toUpperCase()}</p>
            </div>
          </div>
        `,
      });

      // Correo con las instrucciones de pago para el cliente
      const txt = esIngles
        ? {
            asunto: `Your reservation at Veta & Lux — Order ${numeroPedido}`,
            subtitulo: "Your pieces are reserved",
            saludo: "Hello",
            cuerpo: "Thank you for your order. We have reserved your pieces for 48 hours. To confirm the purchase, please make a bank transfer with the following details:",
            importe: "Amount",
            titular: "Account holder",
            concepto: "Reference (required)",
            envio: "Insured shipping",
            total: "Total",
            gratis: "Free",
            direccion: "Shipping address",
            pie: "Once we receive the transfer, we will confirm it by email and prepare the shipment. If the transfer is not received within 48 hours, the reservation will be released.",
          }
        : {
            asunto: `Detalles de tu reserva en Veta & Lux — Pedido ${numeroPedido}`,
            subtitulo: "Tus piezas están reservadas",
            saludo: "Hola",
            cuerpo: "Gracias por tu pedido. Hemos reservado tus piezas durante 48 horas. Para confirmar la compra, realiza una transferencia con estos datos:",
            importe: "Importe",
            titular: "Titular",
            concepto: "Concepto (obligatorio)",
            envio: "Portes asegurados",
            total: "Total",
            gratis: "Gratis",
            direccion: "Dirección de envío",
            pie: "En cuanto recibamos la transferencia te lo confirmaremos por correo y prepararemos el envío. Si no la recibimos en 48 horas, la reserva quedará liberada.",
          };

      await transporter.sendMail({
        from: `"Veta & Lux" <info@vetandlux.com>`,
        to: emailCliente,
        subject: txt.asunto,
        html: `
          <div style="font-family: 'Courier New', Courier, monospace; color: #44403c; max-width: 600px; margin: 0 auto; padding: 40px 30px; background-color: #fff; border: 1px solid #e7e5e4;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #1c1917; margin: 0; text-transform: uppercase;">Veta & Lux</h1>
              <p style="font-size: 12px; font-style: italic; color: #78350f; margin-top: 5px;">${txt.subtitulo}</p>
            </div>

            <p style="font-size: 14px; line-height: 1.6;">${txt.saludo} ${nombreHtml},</p>
            <p style="font-size: 14px; line-height: 1.6;">${txt.cuerpo}</p>

            <div style="background-color: #fafaf9; border: 1px solid #e7e5e4; padding: 20px; margin: 25px 0; font-size: 14px; line-height: 1.9;">
              <strong>IBAN:</strong> ${escapeHtml(IBAN)}<br/>
              <strong>${txt.titular}:</strong> ${escapeHtml(TITULAR)}<br/>
              <strong>${txt.importe}:</strong> ${formatoEUR(totalPedido)}<br/>
              <strong>${txt.concepto}:</strong> <span style="background: #fef3c7; padding: 2px 6px;">${numeroPedido}</span>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin: 25px 0;">
              ${filasPiezasHtml}
              ${filasTotalesHtml(txt.envio, txt.total, txt.gratis)}
            </table>

            <p style="font-size: 13px; line-height: 1.6; color: #57534e;">
              <strong>${txt.direccion}:</strong><br/>${direccionHtml}
            </p>

            <p style="font-size: 13px; line-height: 1.6; color: #78350f; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
              ${txt.pie}
            </p>
          </div>
        `,
      });

      const params = new URLSearchParams({
        method: "transferencia",
        orderId: numeroPedido,
        items: resumenPiezas,
        total: totalPedido.toFixed(2),
        clientEmail: emailCliente,
      });

      return NextResponse.json({ url: `/${locale}/checkout/success?${params.toString()}` });
    }

    return NextResponse.json({ error: msg("Método de pago no válido", "Invalid payment method") }, { status: 400 });

  } catch (error) {
    if (error instanceof ErrorCheckout) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("❌ ERROR EN EL PROCESO DEL CHECKOUT:", error);
    // Sin mensaje: el carrito muestra su error genérico ya traducido (CarritoClient.alert_error)
    return NextResponse.json({}, { status: 500 });
  }
}
