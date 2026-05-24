import { NextResponse } from "next/server";
import Stripe from "stripe";
import type { CartLine } from "@/app/components/cart-provider";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const { lines, metodoPago, datosCliente }: { lines: CartLine[]; metodoPago: string; datosCliente: any } = await request.json();

    if (!lines || lines.length === 0) {
      return NextResponse.json({ error: "El carrito está vacío" }, { status: 400 });
    }

    // CASO A: Pago por Tarjeta o PayPal (Stripe)
    if (metodoPago === "stripe") {
      // CORRECCIÓN AQUÍ: Añadimos explícitamente ": CartLine" al parámetro 'line'
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

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?method=stripe`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/carrito`,
        shipping_address_collection: {
          allowed_countries: ["ES", "PT", "FR", "IT", "DE"],
        },
      });

      return NextResponse.json({ url: session.url });
    }

    // CASO B: Transferencia Bancaria
    if (metodoPago === "transferencia") {
      const numeroPedido = `VL-${Math.floor(10000 + Math.random() * 90000)}`;
      
      // CORRECCIÓN AQUÍ: También añadimos ": CartLine" en este mapa por si acaso
      const resumenPiezas = lines.map((line: CartLine) => `${line.quantity}x ${line.nombre}`).join(", ");

      const emailCliente = datosCliente?.email || "No proporcionado";
      const nombreCliente = datosCliente?.nombre || "No proporcionado";

      console.log(`📩 ¡NUEVO PEDIDO DE TRANSFERENCIA RECIBIDO!`);
      console.log(`Pedido: ${numeroPedido} | Cliente: ${nombreCliente} (${emailCliente}) | Items: ${resumenPiezas}`);

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
    console.error("❌ ERROR DETALLADO EN STRIPE:", error.message || error);
    return NextResponse.json({ error: error.message || "Error interno" }, { status: 500 });
  }
}