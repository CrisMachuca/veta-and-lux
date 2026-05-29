import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@sanity/client";
import nodemailer from "nodemailer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error("Falta la firma de Stripe o el secreto del webhook.");
    }
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error(`❌ Error de validación en Webhook: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log(`💰 [WEBHOOK] Procesando sesión completada con éxito: ${session.id}`);

    try {
      const meta = session.metadata || {};
      
      const emailCliente = meta.clientEmail || session.customer_details?.email || "";
      const nombreCliente = meta.clientName || session.customer_details?.name || "Cliente";
      const direccionFormateada = meta.shippingAddress || "Dirección no proporcionada (Recoger en taller)";
      const regionEnvio = meta.regionEnvio || "peninsula";
      const localeCliente = meta.locale || "es"; 

      const totalPedido = (session.amount_total || 0) / 100;
      const costeEnvio = parseFloat(meta.costeEnvio || "0");
      const subtotalPiezas = totalPedido - costeEnvio;

      const productIdsRaw = meta.productIds || "";
      const productIds = productIdsRaw.split(",").filter((id) => id.trim() !== "");

      // 🖼️ OBTENCIÓN Y DISEÑO DE PRODUCTOS (IMAGEN GRANDE 120px + ESPACIO 30px)
      let detallesProductosHtml = "";
      if (productIds.length > 0) {
        try {
          const productosSanity = await writeClient.fetch(
            `*[_id in $ids]{
              _id,
              nombre,
              "imageUrl": imagen.asset->url
            }`,
            { ids: productIds }
          );

          detallesProductosHtml = productosSanity.map((prod: any) => `
            <div style="display: flex; align-items: center; margin-bottom: 25px; padding-bottom: 25px; border-bottom: 1px solid #e7e5e4; clear: both;">
              ${prod.imageUrl ? `
                <img src="${prod.imageUrl}" 
                     alt="${prod.nombre}" 
                     style="width: 120px; height: 120px; object-fit: cover; border-radius: 8px; background-color: #f5f5f4; flex-shrink: 0; margin-right: 30px;" />
              ` : ""}
              <div style="flex-grow: 1;">
                <p style="margin: 0 0 8px 0; font-weight: bold; color: #1c1917; font-size: 16px; font-family: sans-serif; line-height: 1.2;">
                  ${prod.nombre}
                </p>
                <p style="margin: 0; font-size: 11px; color: #a8a29e; font-family: monospace; letter-spacing: 0.5px;">
                  ID: ${prod._id}
                </p>
              </div>
            </div>
          `).join("");
        } catch (sanityError) {
          console.error("❌ Error consultando nombres de productos en Sanity:", sanityError);
          detallesProductosHtml = `<p style="color: #b45309;">(No se pudieron cargar los detalles visuales, IDs: ${productIds.join(", ")})</p>`;
        }
      }

      // 1. 🔄 ACTUALIZACIÓN EN SANITY
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

      const etiquetaRegion = 
        regionEnvio === "peninsula" ? "España Peninsular (Gratuito)" : 
        regionEnvio === "islas" ? "Islas, Ceuta o Melilla" : "Internacional / Europa";

      // 2. 📩 EMAIL INTERNO: Notificación al taller (Tu copia)
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
              Se ha completado un pago a través de Stripe Checkout. Las piezas ya están marcadas como <strong>vendidas</strong> en Sanity.
            </p>

            <div style="background-color: #fff; border: 1px solid #e7e5e4; padding: 20px; border-radius: 12px; margin: 20px 0;">
              <h3 style="margin-top: 0; margin-bottom: 15px; color: #1c1917; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #78350f; padding-bottom: 5px; display: inline-block;">
                🖼️ Obras a preparar para envío:
              </h3>
              ${detallesProductosHtml || `<p style="font-size: 14px; color: #78716c;">IDs: ${productIds.join(", ")}</p>`}
            </div>

            <div style="background-color: #f5f5f4; padding: 20px; border-radius: 12px; margin: 25px 0;">
              <h3 style="margin-top: 0; color: #1c1917; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Cliente:</h3>
              <p style="font-size: 14px; color: #57534e; margin-bottom: 15px;">${nombreCliente} (<a href="mailto:${emailCliente}" style="color: #78350f;">${emailCliente}</a>)</p>
              
              <h3 style="margin-top: 0; color: #1c1917; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Dirección de Envío:</h3>
              <p style="font-size: 14px; color: #57534e; margin-bottom: 15px;">${direccionFormateada}</p>
              
              <h3 style="color: #1c1917; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-top: 0;">Logística aplicada:</h3>
              <p style="font-size: 14px; color: #57534e; margin-bottom: 15px;">${etiquetaRegion} — ${costeEnvio === 0 ? "Gratis" : `${costeEnvio}€`}</p>
              
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
              ID de Transacción Stripe: ${session.payment_intent} | Idioma de compra: ${localeCliente.toUpperCase()}
            </p>
          </div>
        `,
      });

      // 3. 📩 EMAIL DE CLIENTE (Dinamizado en base al idioma de compra)
      const esIngles = localeCliente === "en";

      const asuntoEmail = esIngles 
        ? "Purchase Confirmation at Veta & Lux — Thank you!"
        : "Confirmación de tu compra en Veta & Lux — ¡Gracias!";

      const subtituloEmail = esIngles
        ? "Your payment has been successfully processed"
        : "Tu pago ha sido procesado con éxito";

      const mensajeCuerpo = esIngles
        ? "Thank you very much for your trust. We have successfully received your card payment. Your piece is now officially allocated and we are preparing its handcrafted protective packaging in the workshop."
        : "Muchísimas gracias por tu confianza. Hemos recibido correctamente el pago con tarjeta. Tu pieza ya está oficialmente adjudicada y estamos preparando su embalaje protector artesanal en el taller.";

      const tituloEntrega = esIngles ? "Delivery Information:" : "Información de Entrega:";
      const txtDireccion = esIngles ? "Destination address:" : "Dirección de destino:";
      const txtModalidad = esIngles ? "Shipping type:" : "Modalidad:";
      const labelRegion = esIngles ? `Shipping for ${regionEnvio}` : `Envíos para ${etiquetaRegion}`;
      
      const txtObras = esIngles ? "Purchased pieces:" : "Obras compradas:";
      const txtPortes = esIngles ? "Insured shipping:" : "Portes asegurados:";
      const txtTotal = esIngles ? "Total Charged:" : "Total Cargado:";
      const txtGratis = esIngles ? "Free" : "Gratis";

      const txtPieDePagina = esIngles
        ? "As soon as the courier collects the package from the workshop, we will send you an email with the tracking number so you can monitor its arrival."
        : "En cuanto el transportista recoja el paquete del taller, te enviaremos un correo electrónico con el número de seguimiento para que puedas monitorizar su llegada.";

      await transporter.sendMail({
        from: `"Veta & Lux" <info@vetandlux.com>`,
        to: emailCliente,
        subject: asuntoEmail,
        html: `
          <div style="font-family: 'Courier New', Courier, monospace; color: #44403c; max-width: 600px; margin: 0 auto; padding: 40px 30px; background-color: #fff; border: 1px solid #e7e5e4;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #1c1917; margin: 0; text-transform: uppercase;">Veta & Lux</h1>
              <p style="font-size: 12px; font-style: italic; color: #78350f; margin-top: 5px;">${subtituloEmail}</p>
            </div>

            <p style="font-size: 14px; line-height: 1.6;">${esIngles ? 'Hello' : 'Hola'} ${nombreCliente},</p>
            <p style="font-size: 14px; line-height: 1.6;">${mensajeCuerpo}</p>

            <div style="border-top: 1px dashed #ccc; border-bottom: 1px dashed #ccc; padding: 20px 0; margin: 30px 0;">
              <h3 style="font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin-top: 0; color: #1c1917;">${tituloEntrega}</h3>
              <p style="font-size: 13px; line-height: 1.6; color: #57534e; margin-bottom: 0;">
                <strong>${txtDireccion}</strong><br/>
                ${direccionFormateada}
              </p>
              <p style="font-size: 13px; margin-top: 10px; color: #57534e;">
                <strong>${txtModalidad}</strong> ${labelRegion}
              </p>
            </div>

            <div style="margin: 25px 0; padding: 5px 0;">
               ${detallesProductosHtml}
            </div>

            <div style="text-align: right; font-size: 14px; line-height: 1.8;">
              <p style="margin: 0; color: #666;">${txtObras} ${subtotalPiezas.toFixed(2)}€</p>
              <p style="margin: 0; color: #666;">${txtPortes} ${costeEnvio === 0 ? txtGratis : `${costeEnvio.toFixed(2)}€`}</p>
              <h4 style="font-size: 16px; font-weight: bold; color: #1c1917; margin-top: 10px; margin-bottom: 0; border-top: 1px solid #eee; padding-top: 10px;">${txtTotal} ${totalPedido.toFixed(2)}€</h4>
            </div>

            <p style="font-size: 13px; line-height: 1.6; color: #78350f; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
              ${txtPieDePagina}
            </p>
          </div>
        `,
      });

    } catch (error: any) {
      console.error("❌ ERROR CRÍTICO PROCESANDO EL WEBHOOK:", error);
      return NextResponse.json({ error: "Fallo interno procesando la compra en el servidor." }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}