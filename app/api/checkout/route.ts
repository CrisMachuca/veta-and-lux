import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@sanity/client";
import nodemailer from "nodemailer";
import type { CartLine } from "@/app/[locale]/components/cart-provider";

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
      costeEnvio = 0,
      locale = "es" // 🌟 NUEVO: Recibimos el idioma actual desde el frontend (por defecto 'es')
    }: { 
      lines: CartLine[]; 
      metodoPago: string; 
      datosCliente: any;
      regionEnvio?: "peninsula" | "islas" | "internacional";
      costeEnvio?: number;
      locale?: string; // 🌟 Tipo añadido para TypeScript
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

    // Cortafuegos de seguridad global
    if (regionEnvio === "peninsula" && (dir?.paisBase === "Francia" || dir?.paisBase === "FR")) {
      return NextResponse.json(
        { error: "Incongruencia de tarifas: El país de destino no corresponde con la tarifa elegida." }, 
        { status: 400 }
      );
    }

    // Construcción de la dirección en formato texto legible
    const direccionCompletaTexto = `${dir?.calle || ""}, CP: ${dir?.codigoPostal || ""}, ${dir?.localidad || ""} ${dir?.regionUbicacion ? `(${dir.regionUbicacion})` : ""}, ${dir?.paisBase || ""}`;
    const subtotalPiezas = lines.reduce((acc, line) => acc + (line.precioUnit * line.quantity), 0);
    const totalPedido = subtotalPiezas + costeEnvio;

    // ==========================================================
    // 💳 CASO A: Pago por Tarjeta o PayPal (Stripe)
    // ==========================================================
    if (metodoPago === "stripe") {
      
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

      if (costeEnvio > 0) {
        lineItems.push({
          price_data: {
            currency: "eur",
            product_data: {
              name: `Gastos de Envío Asegurado (${etiquetaRegion})`,
              description: "Tarifa calculada según la dirección del cliente",
            },
            unit_amount: Math.round(costeEnvio * 100),
          },
          quantity: 1,
        });
      }

      // Creamos la sesión de Stripe
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        customer_email: emailCliente,
        
        // Pasamos toda la información necesaria a los metadatos.
        // 💡 Importante: Guardamos el idioma aquí para que el Webhook lo sepa si hace falta.
        metadata: {
          productIds: lines.map((line: CartLine) => line.productId).join(","),
          clientName: nombreCliente,
          clientEmail: emailCliente,
          shippingAddress: direccionCompletaTexto,
          regionEnvio: regionEnvio,
          costeEnvio: costeEnvio.toString(),
          locale: locale, 
        },

        // 🌟 RUTAS CORREGIDAS: Inyectamos el /[locale]/ dinámicamente
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/checkout/success?method=stripe&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/carrito`,
        
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

      // Correo Interno para el taller
      await transporter.sendMail({
        from: `"Veta & Lux — Tienda" <info@vetandlux.com>`,
        to: process.env.EMAIL_NOTIFICACIONES, 
        subject: `🚨 Nueva Reserva por Transferencia [${numeroPedido}]: ${lines[0]?.nombre || "Pedido"}`,
        html: `... Tu HTML actual se mantiene exactamente igual ...`,
      });

      // Correo Informativo con IBAN para el Cliente
      await transporter.sendMail({
        from: `"Veta & Lux" <info@vetandlux.com>`, 
        to: emailCliente, 
        subject: `Detalles de tu reserva en Veta & Lux — Pedido ${numeroPedido}`,
        html: `... Tu HTML actual se mantiene exactamente igual ...`,
      });

      const params = new URLSearchParams({
        method: "transferencia",
        orderId: numeroPedido,
        items: resumenPiezas,
        clientEmail: emailCliente
      });

      // 🌟 RUTA CORREGIDAS: Añadimos el idioma al retorno de la transferencia
      return NextResponse.json({ url: `/${locale}/checkout/success?${params.toString()}` });
    }

    return NextResponse.json({ error: "Método de pago no válido" }, { status: 400 });

  } catch (error: any) {
    console.error("❌ ERROR EN EL PROCESO DEL CHECKOUT:", error.message || error);
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 });
  }
}