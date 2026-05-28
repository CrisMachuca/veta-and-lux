import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@sanity/client";
import nodemailer from "nodemailer";

// 1. Inicialización de Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// 2. Inicialización de Sanity con permisos de ESCRITURA
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-03-25",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false, // Forzamos false para actualizar el stock en tiempo real
});

// 3. Servidor de envío SMTP para confirmaciones de pago
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_NOTIFICACIONES,
    pass: process.env.GMAIL_CLAVE_APLICACION,
  },
});

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  let event: Stripe.Event;

  // 🛡️ CORTAFUEGOS: Validamos que la petición venga realmente de Stripe y no sea un ataque
  try {
    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error("Falta la firma de Stripe o el secreto del webhook.");
    }
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error(`❌ Error de validación en Webhook: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // 💰 ESCUCHA: El pago con tarjeta ha sido completado con éxito
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log(`💰 [WEBHOOK] Procesando sesión completada con éxito: ${session.id}`);

    try {
      // 🌟 EXTRACCIÓN DESDE METADATOS:
      // Recuperamos toda la información que el cliente rellenó en tu carrito web
      const meta = session.metadata || {};
      
      const emailCliente = meta.clientEmail || session.customer_details?.email || "";
      const nombreCliente = meta.clientName || session.customer_details?.name || "Cliente";
      const direccionFormateada = meta.shippingAddress || "Dirección no proporcionada (Recoger en taller)";
      const regionEnvio = meta.regionEnvio || "peninsula";
      
      // Cálculos monetarios (Stripe devuelve céntimos, convertimos a Euros)
      const totalPedido = (session.amount_total || 0) / 100;
      const costeEnvio = parseFloat(meta.costeEnvio || "0");
      const subtotalPiezas = totalPedido - costeEnvio;

      // Recuperamos los IDs de los productos comprados (separados por comas en el Checkout)
      const productIdsRaw = meta.productIds || "";
      const productIds = productIdsRaw.split(",").filter((id) => id.trim() !== "");

      if (productIds.length === 0) {
        console.warn("⚠️ No se encontraron IDs de productos en los metadatos de esta sesión.");
      }

      // 1. 🔄 ACTUALIZACIÓN EN SANITY: Pasamos las piezas de "reservado" a "vendido"
      const promesasSanity = productIds.map((id) =>
        writeClient
          .patch(id)
          .set({ estado: "vendido" })
          .commit()
          .then((res) => {
            console.log(`✅ Producto ${id} marcado como VENDIDO en Sanity.`);
            return res;
          })
          .catch((err) => {
            console.error(`❌ Error al actualizar producto ${id} en Sanity:`, err);
            throw err;
          })
      );
      
      await Promise.all(promesasSanity);

      // Etiqueta bonita para la región en el correo electrónico
      const etiquetaRegion = 
        regionEnvio === "peninsula" ? "España Peninsular (Gratuito)" : 
        regionEnvio === "islas" ? "Islas, Ceuta o Melilla" : "Internacional / Europa";

      // 2. 📩 EMAIL INTERNO: Notificación automática al administrador del taller
      await transporter.sendMail({
        from: `"Veta & Lux — Pasarela" <info@vetandlux.com>`,
        to: process.env.EMAIL_NOTIFICACIONES,
        subject: `✅ ¡PIEZA VENDIDA! Pago confirmado vía Tarjeta`,
        html: `
          <div style="font-family: sans-serif; color: #292524; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e7e5e4; border-radius: 16px; background-color: #fafaf9;">
            <h2 style="color: #15803d; font-weight: bold; font-size: 22px; border-bottom: 1px solid #e7e5e4; padding-bottom: 15px; margin-top: 0;">
              💰 ¡Pago de Tarjeta Confirmado!
            </h2>
            <p style="font-size: 15px; line-height: 1.6; color: #44403c;">
              Se ha completado un pago a través de Stripe Checkout de forma segura. Las piezas asociadas ya han sido marcadas como <strong>vendidas</strong> en Sanity.
            </p>
            <div style="background-color: #f5f5f4; padding: 20px; border-radius: 12px; margin: 25px 0;">
              <h3 style="margin-top: 0; color: #1c1917; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Cliente:</h3>
              <p style="font-size: 14px; color: #57534e; margin-bottom: 15px;">${nombreCliente} (<a href="mailto:${emailCliente}" style="color: #78350f;">${emailCliente}</a>)</p>
              
              <h3 style="margin-top: 0; color: #1c1917; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Dirección de Envío (Desde tu Web):</h3>
              <p style="font-size: 14px; color: #57534e; margin-bottom: 15px;">${direccionFormateada}</p>
              
              <h3 style="color: #1c1917; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-top: 0;">Logística aplicada:</h3>
              <p style="font-size: 14px; color: #57534e; margin-bottom: 15px;">${etiquetaRegion} — ${costeEnvio === 0 ? "Gratis" : `${costeEnvio}€`}</p>

              <h3 style="color: #1c1917; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-top: 0;">IDs de Sanity Vendidos:</h3>
              <p style="font-size: 13px; font-family: monospace; color: #7c2d12; margin-bottom: 15px;">${productIds.join(", ")}</p>
              
              <p style="font-size: 14px; color: #57534e; margin-top: 15px; border-top: 1px solid #e7e5e4; padding-top: 10px; margin-bottom: 5px;">
                Subtotal piezas: ${subtotalPiezas.toFixed(2)}€
              </p>
              <p style="font-size: 14px; color: #57534e; margin-bottom: 5px; margin-top: 0;">
                Envío: ${costeEnvio === 0 ? "0.00€" : `${costeEnvio.toFixed(2)}€`}
              </p>
              <p style="font-size: 17px; color: #15803d; border-top: 1px dashed #e7e5e4; padding-top: 10px; font-weight: bold; margin-top: 5px;">
                Total Neto Recibido: ${totalPedido.toFixed(2)}€
              </p>
            </div>
            <p style="font-size: 12px; color: #78716c; text-align: center; margin-top: 20px;">
              ID de Transacción Stripe: ${session.payment_intent}
            </p>
          </div>
        `,
      });

      // 3. 📩 EMAIL DE CLIENTE: Comprobante de compra para el comprador
      await transporter.sendMail({
        from: `"Veta & Lux" <info@vetandlux.com>`,
        to: emailCliente,
        subject: `Confirmación de tu compra en Veta & Lux — ¡Gracias!`,
        html: `
          <div style="font-family: 'Courier New', Courier, monospace; color: #44403c; max-width: 600px; margin: 0 auto; padding: 40px 30px; background-color: #fff; border: 1px solid #e7e5e4;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #1c1917; margin: 0; text-transform: uppercase;">Veta & Lux</h1>
              <p style="font-size: 12px; font-style: italic; color: #78350f; margin-top: 5px;">Tu pago ha sido procesado con éxito</p>
            </div>

            <p style="font-size: 14px; line-height: 1.6;">Hola ${nombreCliente},</p>
            <p style="font-size: 14px; line-height: 1.6;">
              Muchísimas gracias por tu confianza. Hemos recibido correctamente el pago con tarjeta. Tu pieza ya está oficialmente adjudicada y estamos preparando su embalaje protector artesanal en el taller.
            </p>

            <div style="border-top: 1px dashed #ccc; border-bottom: 1px dashed #ccc; padding: 20px 0; margin: 30px 0;">
              <h3 style="font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin-top: 0; color: #1c1917;">Información de Entrega:</h3>
              <p style="font-size: 13px; line-height: 1.6; color: #57534e; margin-bottom: 0;">
                <strong>Dirección de destino:</strong><br/>
                ${direccionFormateada}
              </p>
              <p style="font-size: 13px; margin-top: 10px; color: #57534e;">
                <strong>Modalidad:</strong> Envíos para ${etiquetaRegion}
              </p>
            </div>

            <div style="text-align: right; font-size: 14px; line-height: 1.8;">
              <p style="margin: 0; color: #666;">Obras compradas: ${subtotalPiezas.toFixed(2)}€</p>
              <p style="margin: 0; color: #666;">Portes asegurados: ${costeEnvio === 0 ? "Gratis" : `${costeEnvio.toFixed(2)}€`}</p>
              <h4 style="font-size: 16px; font-weight: bold; color: #1c1917; margin-top: 10px; margin-bottom: 0; border-top: 1px solid #eee; padding-top: 10px;">Total Cargado: ${totalPedido.toFixed(2)}€</h4>
            </div>

            <p style="font-size: 13px; line-height: 1.6; color: #78350f; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
              En cuanto el transportista recoja el paquete del taller, te enviaremos un correo electrónico con el número de seguimiento para que puedas monitorizar su llegada.
            </p>
          </div>
        `,
      });

    } catch (error: any) {
      console.error("❌ ERROR CRÍTICO PROCESANDO EL WEBHOOK:", error);
      // Retornamos un 500 para que Stripe sepa que hubo un fallo interno de base de datos/correo y vuelva a reintentar el webhook
      return NextResponse.json({ error: "Fallo interno procesando la compra en el servidor." }, { status: 500 });
    }
  }

  // Respondemos con un 200 a Stripe para decirle que recibimos el evento correctamente
  return NextResponse.json({ received: true });
}