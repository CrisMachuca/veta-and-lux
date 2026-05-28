import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@sanity/client";
import nodemailer from "nodemailer";
import type { CartLine } from "@/app/components/cart-provider";

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

export async function POST(request: Request) {
  try {
    const { 
      lines, 
      metodoPago, 
      datosCliente,
      regionEnvio = "peninsula",
      costeEnvio = 0 
    }: { 
      lines: CartLine[]; 
      metodoPago: string; 
      datosCliente: any;
      regionEnvio?: "peninsula" | "islas" | "internacional";
      costeEnvio?: number;
    } = await request.json();

    if (!lines || lines.length === 0) {
      return NextResponse.json({ error: "El carrito está vacío" }, { status: 400 });
    }

    // Traducción de regiones para el bloque de correo y metadatos
    const etiquetaRegion = 
      regionEnvio === "peninsula" ? "España Peninsular" : 
      regionEnvio === "islas" ? "Islas, Ceuta o Melilla" : "Internacional / Europa";

    // Reutilizamos el desglose de dirección que ya recopilas en tu frontend
    const dir = datosCliente?.direccion;
    const emailCliente = datosCliente?.email || "";
    const nombreCliente = datosCliente?.nombre || "Cliente";

    if (!emailCliente) {
      return NextResponse.json({ error: "El email del cliente es obligatorio" }, { status: 400 });
    }

    // Cortafuegos de seguridad global: si seleccionan Francia en tu carrito pero dicen que es tarifa peninsular, bloqueamos.
    // Ajusta "Francia" o "FR" según guardes el valor del país en tu formulario.
    if (regionEnvio === "peninsula" && (dir?.paisBase === "Francia" || dir?.paisBase === "FR")) {
      return NextResponse.json(
        { error: "Incongruencia de tarifas: El país de destino no corresponde con la tarifa elegida." }, 
        { status: 400 }
      );
    }

    // Construcción de la dirección en formato texto legible para los correos
    const direccionCompletaTexto = `${dir?.calle || ""}, CP: ${dir?.codigoPostal || ""}, ${dir?.localidad || ""} ${dir?.regionUbicacion ? `(${dir.regionUbicacion})` : ""}, ${dir?.paisBase || ""}`;
    const subtotalPiezas = lines.reduce((acc, line) => acc + (line.precioUnit * line.quantity), 0);
    const totalPedido = subtotalPiezas + costeEnvio;

    // ==========================================================
    // 💳 CASO A: Pago por Tarjeta o PayPal (Stripe)
    // ==========================================================
    if (metodoPago === "stripe") {
      
      // Construimos las líneas de los productos comprados
      const lineItems: any[] = lines.map((line: CartLine) => {
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

      // 🌟 SOLUCIÓN DEFINITIVA: 
      // Si el coste del envío en tu carrito es mayor que 0, se lo inyectamos a Stripe 
      // como si fuera un producto más del checkout. Así el precio total se calculará de forma exacta.
      if (costeEnvio > 0) {
        lineItems.push({
          price_data: {
            currency: "eur",
            product_data: {
              name: `Gastos de Envío Asegurado (${etiquetaRegion})`,
              description: "Tarifa calculada según la dirección del cliente",
            },
            unit_amount: Math.round(costeEnvio * 100), // Ej: 6500 para 65,00€
          },
          quantity: 1,
        });
      }

      // Creamos la sesión de Stripe limpia de dirección y tarifas
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        customer_email: emailCliente, // Autorellena su email en Stripe para ahorrarle pasos
        
        // Pasamos toda la dirección y datos que capturaste en el carrito a los metadatos de Stripe
        // para tenerlos de referencia y poder leerlos después en tu Webhook
        metadata: {
          productIds: lines.map((line: CartLine) => line.productId).join(","),
          clientName: nombreCliente,
          clientEmail: emailCliente,
          shippingAddress: direccionCompletaTexto,
          regionEnvio: regionEnvio,
          costeEnvio: costeEnvio.toString(),
        },

        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?method=stripe`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/carrito`,
        
        // ❌ Desactivamos las colecciones nativas de Stripe. 
        // Ya no le pedimos la dirección ni tarifas a Stripe porque ya las tenemos del carrito.
        shipping_address_collection: undefined,
        shipping_options: undefined,
      });

      return NextResponse.json({ url: session.url });
    }

    // ==========================================================
    // 🏦 CASO B: Transferencia Bancaria
    // ==========================================================
    if (metodoPago === "transferencia") {
      const numeroPedido = `VL-${Math.floor(10000 + Math.random() * 90000)}`;
      const resumenPiezas = lines.map((line: CartLine) => `${line.quantity}x ${line.nombre}`).join(", ");
      
      // Mutamos el estado en Sanity de inmediato a "reservado"
      const promesasSanity = lines.map((line: CartLine) =>
        writeClient
          .patch(String(line.productId))
          .set({ estado: "reservado" })
          .commit()
      );
      await Promise.all(promesasSanity);

      // Bloque HTML de los artículos para los correos
      const listaProductosHtml = lines.map((line: CartLine) => `
        <li style="margin-bottom: 8px; color: #44403c;">
          <strong>${line.nombre}</strong> x ${line.quantity} — ${line.precioUnit}€/ud
        </li>
      `).join("");

      // Correo Interno para la administración del taller
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
              El cliente <strong>${nombreCliente}</strong> (<a href="mailto:${emailCliente}" style="color: #78350f;">${emailCliente}</a>) ha solicitado pagar por transferencia bancaria.
            </p>
            <div style="background-color: #f5f5f4; padding: 20px; border-radius: 12px; margin: 25px 0;">
              <h3 style="margin-top: 0; color: #1c1917; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Código de Referencia:</h3>
              <p style="font-size: 16px; font-weight: bold; color: #78350f; margin-bottom: 15px;">${numeroPedido}</p>
              
              <h3 style="margin-top: 0; color: #1c1917; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Dirección de Envío Recopilada:</h3>
              <p style="font-size: 14px; color: #57534e; margin-bottom: 15px;">${direccionCompletaTexto}</p>
              
              <h3 style="color: #1c1917; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-top: 0;">Tarifa Aplicada:</h3>
              <p style="font-size: 14px; color: #57534e; margin-bottom: 15px;">${etiquetaRegion} (${costeEnvio === 0 ? "Gratis" : `${costeEnvio}€`})</p>
              
              <h3 style="color: #1c1917; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-top: 0;">Piezas Congeladas:</h3>
              <ul style="padding-left: 20px; margin-bottom: 10px; font-size: 14px;">
                ${listaProductosHtml}
              </ul>
              <p style="font-size: 14px; color: #57534e; margin-top: 15px; border-top: 1px solid #e7e5e4; padding-top: 10px; margin-bottom: 5px;">
                Subtotal obras: ${subtotalPiezas}€
              </p>
              <p style="font-size: 14px; color: #57534e; margin-bottom: 10px; margin-top: 0;">
                Coste de envío: ${costeEnvio === 0 ? "De cortesía" : `${costeEnvio}€`}
              </p>
              <p style="font-size: 16px; color: #1c1917; border-top: 1px dashed #e7e5e4; padding-top: 10px; font-weight: bold; margin-top: 5px;">
                Importe total a recibir: ${totalPedido}€
              </p>
            </div>
          </div>
        `,
      });

      // Correo Informativo con IBAN dirigido al Cliente
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
              Hemos recibido tu solicitud correctamente y **hemos reservado la pieza de forma exclusiva para ti** en nuestro taller.
            </p>

            <div style="border-top: 1px dashed #ccc; border-bottom: 1px dashed #ccc; padding: 20px 0; margin: 30px 0;">
              <h3 style="font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin-top: 0; color: #1c1917;">Resumen de tu selección:</h3>
              <ul style="padding-left: 20px; font-size: 14px; line-height: 1.8; margin-bottom: 10px;">
                ${listaProductosHtml}
              </ul>
              <p style="font-size: 13px; margin-top: 15px; margin-bottom: 5px; color: #666;">Subtotal piezas: ${subtotalPiezas}€</p>
              <p style="font-size: 13px; margin-bottom: 15px; margin-top: 0; color: #666;">Envío asegurado (${etiquetaRegion}): ${costeEnvio === 0 ? "De cortesía (Gratis)" : `${costeEnvio}€`}</p>
              <p style="font-size: 16px; font-weight: bold; margin-top: 10px; margin-bottom: 0; color: #1c1917; border-top: 1px solid #eee; padding-top: 10px;">Total del Pedido: ${totalPedido}€</p>
            </div>

            <div style="background-color: #fafaf9; border: 1px solid #e7e5e4; padding: 25px; margin: 30px 0;">
              <h3 style="font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin-top: 0; color: #78350f;">Instrucciones para completar el pago:</h3>
              <table style="font-size: 13px; width: 100%; line-height: 1.8;">
                <tr><td style="width: 100px; color: #78350f;"><strong>Banco:</strong></td><td>[TU BANCO AQUÍ]</td></tr>
                <tr><td style="color: #78350f;"><strong>Titular:</strong></td><td>Veta & Lux</td></tr>
                <tr><td style="color: #78350f;"><strong>IBAN:</strong></td><td><code style="font-size: 14px; font-weight: bold; background: #e7e5e4; padding: 2px 6px; border-radius: 4px;">ESXX 0000 0000 0000 0000 0000</code></td></tr>
                <tr><td style="color: #78350f;"><strong>Concepto:</strong></td><td><strong>${numeroPedido} — ${nombreCliente}</strong></td></tr>
              </table>
            </div>

            <p style="font-size: 13px; line-height: 1.6; color: #78350f; font-style: italic;">
              *Nota: Una vez transcurridas 48 horas sin recibir el ingreso, la pieza volverá a mostrarse como disponible automáticamente en la web.
            </p>
          </div>
        `,
      });

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
    console.error("❌ ERROR EN EL PROCESO DEL CHECKOUT:", error.message || error);
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 });
  }
}