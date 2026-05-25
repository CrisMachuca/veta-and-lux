import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@sanity/client";
import nodemailer from "nodemailer";

// 🌟 OBLIGATORIO: Forzamos a Next.js a tratar esta ruta como dinámica 
// Esto evita errores al leer el cuerpo de la petición con request.text()
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Inicialización de Sanity con permisos de ESCRITURA (Token de Editor)
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-03-25",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false, // Falso para actualizar el stock en vivo sin caché
});

// Configuración del transporte de correo de Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_NOTIFICACIONES,
    pass: process.env.GMAIL_CLAVE_APLICACION,
  },
});

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
      console.error("❌ [WEBHOOK] Faltan firmas de seguridad o STRIPE_WEBHOOK_SECRET en .env");
      return NextResponse.json({ error: "Faltan firmas de seguridad" }, { status: 400 });
    }
    
    // Verificamos de forma segura que la petición proviene realmente de Stripe
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error(`❌ Error de verificación de Webhook de Stripe: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Escuchamos únicamente cuando el pago con tarjeta ha sido un éxito rotundo
  if (event.type === "checkout.session.completed") {
    // 🌟 CORRECCIÓN: Usamos 'as any' para evitar que TypeScript bloquee las propiedades de envío
    const session = event.data.object as any;

    console.log(`💰 [WEBHOOK] Procesando sesión completada con éxito: ${session.id}`);

    // 1. Extraemos los datos del comprador registrados en la pasarela de Stripe
    const emailCliente = session.customer_details?.email || "";
    const nombreCliente = session.customer_details?.name || "Cliente Stripe";
    const totalPedido = (session.amount_total || 0) / 100;

    // Recuperamos y formateamos la dirección física de envío recogida por Stripe
    const addr = session.shipping_details?.address;
    const direccionFormateada = addr 
      ? `${session.shipping_details?.name}. ${addr.line1} ${addr.line2 || ""}, ${addr.postal_code}, ${addr.city} (${addr.country})`
      : "No requerida / No proporcionada";

    // 2. Traemos los artículos comprados expandiendo la sesión de Stripe
    let listaProductosHtml = "<li>Piezas del pedido de Veta & Lux</li>";
    try {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      if (lineItems && lineItems.data.length > 0) {
        listaProductosHtml = lineItems.data.map((item) => `
          <li style="margin-bottom: 8px; color: #44403c;">
            <strong>${item.description}</strong> x ${item.quantity} — ${(item.amount_total / 100)}€
          </li>
        `).join("");
      }
    } catch (e: any) {
      console.error("⚠️ No se pudieron recuperar las líneas de productos desde Stripe:", e.message);
    }

    // 📬 SECCIÓN DE ENVÍO DE EMAILS (Aislada en su propio try/catch para mayor seguridad)
    try {
      console.log(`✉️ Enviando alerta de venta interna a: ${process.env.EMAIL_NOTIFICACIONES}`);
      
      // Correo para TI (Notificación Verde de Inyección de Capital)
      await transporter.sendMail({
        from: `"Veta & Lux — Tienda" <info@vetandlux.com>`,
        to: process.env.EMAIL_NOTIFICACIONES,
        subject: `💰 ¡NUEVA VENTA ONLINE TARJETA! — ${nombreCliente}`,
        html: `
          <div style="font-family: sans-serif; color: #292524; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e7e5e4; border-radius: 16px; background-color: #fafaf9;">
            <h2 style="color: #166534; font-style: italic; font-weight: normal; font-size: 24px; border-bottom: 1px solid #e7e5e4; padding-bottom: 15px; margin-top: 0;">
              ¡Dinero recibido en Stripe!
            </h2>
            <p style="font-size: 15px; line-height: 1.6; color: #44403c;">
              El cliente <strong>${nombreCliente}</strong> (<a href="mailto:${emailCliente}">${emailCliente}</a>) ha completado el pago con tarjeta de forma segura.
            </p>
            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px; border-radius: 12px; margin: 25px 0;">
              <h3 style="margin-top: 0; color: #14532d; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Dirección de Envío Verificada por Stripe:</h3>
              <p style="font-size: 14px; color: #166534; margin-bottom: 15px;">${direccionFormateada}</p>
              <h3 style="color: #14532d; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-top: 0;">Piezas Pagadas:</h3>
              <ul style="padding-left: 20px; margin-bottom: 10px; font-size: 14px; color: #166534;">
                ${listaProductosHtml}
              </ul>
              <p style="font-size: 17px; color: #14532d; margin-top: 15px; border-top: 1px solid #bbf7d0; padding-top: 10px; font-weight: bold;">
                Total Neto Cobrado: ${totalPedido}€
              </p>
            </div>
            <p style="font-size: 12px; color: #71717a;">ID de transacción de Stripe: ${session.id}</p>
          </div>
        `,
      });

      if (emailCliente) {
        console.log(`✉️ Enviando confirmación de compra al comprador a: ${emailCliente}`);
        
        // Correo para el CLIENTE (Estilo minimalista/monoespacio de recibo de taller)
        await transporter.sendMail({
          from: `"Veta & Lux" <info@vetandlux.com>`,
          to: emailCliente,
          subject: `Confirmación de tu compra en Veta & Lux`,
          html: `
            <div style="font-family: 'Courier New', Courier, monospace; color: #44403c; max-width: 600px; margin: 0 auto; padding: 40px 30px; background-color: #fff; border: 1px solid #e7e5e4;">
              <div style="text-align: center; margin-bottom: 40px;">
                <h1 style="font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #1c1917; margin: 0; text-transform: uppercase;">Veta & Lux</h1>
                <p style="font-size: 12px; font-style: italic; color: #78350f; margin-top: 5px;">Pago confirmado correctamente</p>
              </div>

              <p style="font-size: 14px; line-height: 1.6;">Hola ${nombreCliente},</p>
              <p style="font-size: 14px; line-height: 1.6;">
                Queremos confirmarte que hemos recibido tu pago con tarjeta correctamente. Muchas gracias por adquirir una pieza con historia y diseño de autor.
              </p>

              <div style="border-top: 1px dashed #ccc; border-bottom: 1px dashed #ccc; padding: 20px 0; margin: 30px 0;">
                <h3 style="font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin-top: 0; color: #1c1917;">Tu adquisición:</h3>
                <ul style="padding-left: 20px; font-size: 14px; line-height: 1.8;">
                  ${listaProductosHtml}
                </ul>
                <p style="font-size: 15px; font-weight: bold; margin-top: 15px; margin-bottom: 0;">Total Pagado: ${totalPedido}€</p>
              </div>

              <p style="font-size: 14px; line-height: 1.6;">
                Nos ponemos manos a la obra en el taller para preparar tu paquete de forma artesanal y segura. En cuanto el transportista recoja la pieza, te escribiremos de nuevo con el número de seguimiento.
              </p>

              <div style="margin-top: 40px; border-top: 1px solid #e7e5e4; padding-top: 30px; font-size: 12px; line-height: 1.6; color: #a8a29e;">
                <span style="font-weight: bold; color: #1c1917; letter-spacing: 1px;">VETA & LUX STUDIO</span><br />
                Si tienes cualquier duda, responde directamente a este correo.
              </div>
            </div>
          `,
        });
      }

      console.log(`✅ [STRIPE WEBHOOK] Ambos correos se enviaron perfectamente.`);

    } catch (errorMail: any) {
      console.error("❌ Error interno enviando los correos desde Nodemailer:", errorMail.message || errorMail);
    }

    // 🌟 SECCIÓN SANITY: Actualización automatizada del stock a "vendido"
    try {
      // Recuperamos el string con los IDs que guardamos en los metadatos de la sesión
      const productIdsString = session.metadata?.productIds;

      if (productIdsString) {
        console.log(`🪵 [SANITY] Solicitando mutación de stock para los IDs: ${productIdsString}`);
        
        // Desestructuramos el string separado por comas en un array limpio
        const productIds = productIdsString.split(",");

        // Generamos y disparamos las promesas de parcheo en lote hacia Sanity
        const promesasSanity = productIds.map((id: string) =>
          writeClient
            .patch(String(id).trim())
            .set({ estado: "vendido" })
            .commit()
        );

        await Promise.all(promesasSanity);
        console.log("✅ [SANITY OK] Las lámparas compradas pasaron con éxito a estado 'vendido'.");
      } else {
        console.warn("⚠️ No se detectó la propiedad 'productIds' en los metadatos de Stripe.");
      }

    } catch (errorSanity: any) {
      console.error("❌ Error actualizando el catálogo de Sanity desde el Webhook:", errorSanity.message);
    }
  }

  // Retornamos siempre un estado 200 OK a Stripe para confirmar la recepción limpia del evento
  return NextResponse.json({ received: true });
}