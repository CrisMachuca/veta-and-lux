import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@sanity/client";
import nodemailer from "nodemailer";
import type { CartLine } from "@/app/components/cart-provider";

// 1. Inicialización de Stripe (Tu pasarela segura)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// 2. Inicialización de Sanity con permisos de ESCRITURA (Token de Editor)
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-03-25",
  token: process.env.SANITY_WRITE_TOKEN, 
  useCdn: false, // Falso para que el cartel de "Reservado" se vea al instante en la web
});

// 3. Servidor de envío SMTP gratuito a través de tu Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_NOTIFICACIONES,     // Tu dirección de control: vetandlux@gmail.com
    pass: process.env.GMAIL_CLAVE_APLICACION,   // Tus 16 letras amarillas generadas por Google
  },
});

export async function POST(request: Request) {
  try {
    const { lines, metodoPago, datosCliente }: { lines: CartLine[]; metodoPago: string; datosCliente: any } = await request.json();

    if (!lines || lines.length === 0) {
      return NextResponse.json({ error: "El carrito está vacío" }, { status: 400 });
    }

    // ==========================================================
    // 💳 CASO A: Pago por Tarjeta o PayPal (Stripe)
    // ==========================================================
    if (metodoPago === "stripe") {
      const lineItems = lines.map((line: CartLine) => {
        const urlImagenCompleta = line.imagen.startsWith("http")
          ? line.imagen
          : `${process.env.NEXT_PUBLIC_SITE_URL}${line.imagen}`;

        return {
          price_data: {
            currency: "eur",
            product_data: {
              name: line.nombre,
              images: [urlImagenCompleta],
            },
            unit_amount: Math.round(line.precioUnit * 100),
          },
          quantity: line.quantity,
        };
      });

      // Creamos la sesión de Stripe inyectando los IDs de Sanity en los metadatos
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        
        // 🌟 CLAVE: Enviamos los IDs de los productos para que el Webhook pueda leerlos al pagar
        metadata: {
          productIds: lines.map((line: CartLine) => line.productId).join(","),
        },

        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?method=stripe`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/carrito`,
        shipping_address_collection: {
          allowed_countries: ["ES", "PT", "FR", "IT", "DE"],
        },
      });

      return NextResponse.json({ url: session.url });
    }

    // ==========================================================
    // 🏦 CASO B: Transferencia Bancaria (Sanity + Doble Notificación)
    // ==========================================================
    if (metodoPago === "transferencia") {
      const numeroPedido = `VL-${Math.floor(10000 + Math.random() * 90000)}`;
      const resumenPiezas = lines.map((line: CartLine) => `${line.quantity}x ${line.nombre}`).join(", ");
      
      const emailCliente = datosCliente?.email || "";
      const nombreCliente = datosCliente?.nombre || "No proporcionado";
      const direccionCliente = datosCliente?.direccion || "No proporcionada";

      if (!emailCliente) {
        return NextResponse.json({ error: "El email del cliente es obligatorio" }, { status: 400 });
      }

      // Calculamos el precio total acumulado del pedido
      const totalPedido = lines.reduce((acc, line) => acc + (line.precioUnit * line.quantity), 0);

      // 🌟 TAREA 1: Bloquear las piezas en Sanity mutando el estado a "reservado" de inmediato
      const promesasSanity = lines.map((line: CartLine) =>
        writeClient
          .patch(String(line.productId))
          .set({ estado: "reservado" })
          .commit()
      );
      await Promise.all(promesasSanity);

      // Estructura HTML común de las piezas adquiridas
      const listaProductosHtml = lines.map((line: CartLine) => `
        <li style="margin-bottom: 8px; color: #44403c;">
          <strong>${line.nombre}</strong> x ${line.quantity} — ${line.precioUnit}€/ud
        </li>
      `).join("");

      // 📩 TAREA 2: Correo para TI (Alerta de control del taller)
      await transporter.sendMail({
        from: `"Veta & Lux — Tienda" <info@vetandlux.com>`,
        to: process.env.EMAIL_NOTIFICACIONES, 
        subject: `🚨 Nueva Reserva por Transferencia [${numeroPedido}]: ${lines[0]?.nombre || "Pedido"}`,
        html: `
          <div style="font-family: sans-serif; color: #292524; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e7e5e4; border-radius: 16px; background-color: #fafaf9;">
            <h2 style="color: #78350f; font-style: italic; font-weight: normal; font-size: 24px; border-bottom: 1px solid #e7e5e4; padding-bottom: 15px; margin-top: 0;">
              ¡Nueva solicitud de transferencia!
            </h2>
            <p style="font-size: 15px; line-height: 1.6; color: #44403c;">
              El cliente <strong>${nombreCliente}</strong> (<a href="mailto:${emailCliente}" style="color: #78350f;">${emailCliente}</a>) ha solicitado realizar un pago manual por transferencia bancaria.
            </p>
            <div style="background-color: #f5f5f4; padding: 20px; border-radius: 12px; margin: 25px 0;">
              <h3 style="margin-top: 0; color: #1c1917; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Código de Referencia:</h3>
              <p style="font-size: 16px; font-weight: bold; color: #78350f; margin-bottom: 15px;">${numeroPedido}</p>
              <h3 style="margin-top: 0; color: #1c1917; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Dirección de Envío:</h3>
              <p style="font-size: 14px; color: #57534e; margin-bottom: 15px;">${direccionCliente}</p>
              <h3 style="color: #1c1917; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-top: 0;">Piezas Congeladas:</h3>
              <ul style="padding-left: 20px; margin-bottom: 10px; font-size: 14px;">
                ${listaProductosHtml}
              </ul>
              <p style="font-size: 16px; color: #1c1917; margin-top: 15px; border-top: 1px solid #e7e5e4; padding-top: 10px; font-weight: bold;">
                Importe total a recibir: ${totalPedido}€
              </p>
            </div>
          </div>
        `,
      });

      // ✉️ TAREA 3: Correo de instrucciones con tu IBAN para el CLIENTE
      await transporter.sendMail({
        from: `"Veta & Lux" <info@vetandlux.com>`, 
        to: emailCliente, 
        subject: `Detalles de tu reserva en Veta & Lux — Pedido ${numeroPedido}`,
        html: `
          <div style="font-family: 'Courier New', Courier, monospace; color: #44403c; max-width: 600px; margin: 0 auto; padding: 40px 30px; background-color: #fff; border: 1px solid #e7e5e4;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #1c1917; margin: 0; text-transform: uppercase;">Veta & Lux</h1>
              <p style="font-size: 12px; font-style: italic; color: #78350f; margin-top: 5px;">Piezas con alma de madera recuperada</p>
            </div>

            <p style="font-size: 14px; line-height: 1.6;">Hola ${nombreCliente},</p>
            <p style="font-size: 14px; line-height: 1.6;">
              Muchas gracias por valorar la artesanía y el diseño de autor. Hemos recibido tu solicitud de pedido correctamente y **hemos reservado la pieza de forma exclusiva para ti** en nuestro taller para evitar que nadie más pueda adquirirla.
            </p>

            <div style="border-top: 1px dashed #ccc; border-bottom: 1px dashed #ccc; padding: 20px 0; margin: 30px 0;">
              <h3 style="font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin-top: 0; color: #1c1917;">Resumen de tu selección:</h3>
              <ul style="padding-left: 20px; font-size: 14px; line-height: 1.8;">
                ${listaProductosHtml}
              </ul>
              <p style="font-size: 15px; font-weight: bold; margin-top: 15px; margin-bottom: 0;">Total del Pedido: ${totalPedido}€</p>
            </div>

            <div style="background-color: #fafaf9; border: 1px solid #e7e5e4; padding: 25px; margin: 30px 0;">
              <h3 style="font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin-top: 0; color: #78350f;">Instrucciones para completar el pago:</h3>
              <p style="font-size: 13px; line-height: 1.5; margin-bottom: 15px;">
                Para formalizar la compra de manera definitiva, realiza una transferencia bancaria utilizando los siguientes datos en las próximas 48 horas:
              </p>
              <table style="font-size: 13px; width: 100%; line-height: 1.8;">
                <tr>
                  <td style="width: 100px; color: #78350f;"><strong>Banco:</strong></td>
                  <td>[TU BANCO AQUÍ]</td>
                </tr>
                <tr>
                  <td style="color: #78350f;"><strong>Titular:</strong></td>
                  <td>Veta & Lux</td>
                </tr>
                <tr>
                  <td style="color: #78350f;"><strong>IBAN:</strong></td>
                  <td><code style="font-size: 14px; font-weight: bold; background: #e7e5e4; padding: 2px 6px; border-radius: 4px;">ESXX 0000 0000 0000 0000 0000</code></td>
                </tr>
                <tr>
                  <td style="color: #78350f;"><strong>Concepto:</strong></td>
                  <td><strong style="color: #1c1917;">${numeroPedido} — ${nombreCliente}</strong></td>
                </tr>
              </table>
            </div>

            <p style="font-size: 13px; line-height: 1.6; color: #78350f; font-style: italic;">
              *Nota: Una vez transcurridas 48 horas sin recibir el ingreso o el justificante en nuestro correo, la pieza volverá a mostrarse como disponible en la colección de la web de forma automática.
            </p>

            <div style="margin-top: 5px; border-top: 1px solid #e7e5e4; padding-top: 30px; font-size: 12px; line-height: 1.6; color: #a8a29e;">
              <span style="font-weight: bold; color: #1c1917; letter-spacing: 1px;">VETA & LUX STUDIO</span><br />
              Contacto: <a href="mailto:info@vetandlux.com" style="color: #44403c;">info@vetandlux.com</a> | <a href="http://www.vetandlux.com" style="color: #44403c;">vetandlux.com</a>
            </div>
          </div>
        `,
      });

      console.log(`📩 [TRANSFERENCIA OK] Notificaciones gemelas enviadas a administración y al comprador.`);

      const params = new URLSearchParams({
        method: "transferencia",
        orderId: numeroPedido,
        items: resumenPiezas,
        clientEmail: emailCliente
      });

      return NextResponse.json({ url: `/checkout/success?${params.toString()}` });
    }

    return NextResponse.json({ error: "Método de pago no válido" }, { status: 400 });

  } catch (error: any) {
    console.error("❌ ERROR EN EL PROCESO DEL CHECKOUT UNIFICADO:", error.message || error);
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 });
  }
}