import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { invalidarCatalogo, invalidarJournal } from "@/sanity/lib/cache";

// Webhook de Sanity: al publicar, editar o borrar una lámpara o un artículo en el Studio, la web lo muestra al momento.
// Sin este webhook los cambios aparecen igualmente, como mucho en unos 60 s.
// Configuración en sanity.io/manage → API → Webhooks (URL https://www.vetandlux.com/api/revalidar,
// filtro _type in ["producto", "articulo"], método POST y el mismo secreto que SANITY_REVALIDATE_SECRET).
export async function POST(request: NextRequest) {
  const secreto = process.env.SANITY_REVALIDATE_SECRET;
  if (!secreto) {
    return NextResponse.json({ error: "sin-configurar" }, { status: 500 });
  }

  try {
    // Comprueba la firma del webhook y espera a que el cambio sea visible en la API de Sanity
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(request, secreto, true);
    if (!isValidSignature) {
      return NextResponse.json({ error: "firma" }, { status: 401 });
    }
    if (body?._type === "producto") {
      invalidarCatalogo();
      return NextResponse.json({ revalidado: true });
    }
    if (body?._type === "articulo") {
      invalidarJournal();
      return NextResponse.json({ revalidado: true });
    }
    return NextResponse.json({ revalidado: false });
  } catch (error) {
    console.error("❌ Error en el webhook de Sanity:", error);
    return NextResponse.json({ error: "invalido" }, { status: 400 });
  }
}
