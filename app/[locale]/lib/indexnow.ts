// IndexNow: avisa al momento a Bing (y a los buscadores que comparten el protocolo) de que unas páginas
// han cambiado, sin esperar a que vuelvan a rastrearlas. Bing alimenta también a Copilot y a ChatGPT.
// La clave es pública por diseño: el buscador comprueba que el dominio es nuestro leyendo /<clave>.txt (en public/).
import { SITE_URL } from "@/app/[locale]/lib/sitio";

export const INDEXNOW_CLAVE = "447213a4e7f2fe8c92cd27f61d20e678";

// Solo desde el dominio real: en local SITE_URL es localhost y no se avisa a nadie
const PRODUCCION = SITE_URL === "https://www.vetandlux.com";

export async function avisarIndexNow(urls: string[]) {
  const urlList = [...new Set(urls)].filter((u) => u.startsWith(`${SITE_URL}/`));
  if (!PRODUCCION || urlList.length === 0) return;

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: new URL(SITE_URL).host,
        key: INDEXNOW_CLAVE,
        keyLocation: `${SITE_URL}/${INDEXNOW_CLAVE}.txt`,
        urlList,
      }),
      signal: AbortSignal.timeout(8000),
    });
    // 200 = recibido; 202 = recibido, la clave se comprobará después
    if (!res.ok) console.warn(`⚠️ IndexNow respondió ${res.status} para ${urlList.length} URL`);
  } catch (error) {
    // No es grave: el buscador las encontrará igualmente al rastrear el sitemap
    console.warn("⚠️ No se pudo avisar a IndexNow:", error);
  }
}
