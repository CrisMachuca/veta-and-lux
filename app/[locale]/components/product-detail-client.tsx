"use client";

import { useCart } from "@/app/[locale]/components/cart-provider";
import { urlFor } from "@/sanity/lib/client";
import { traducir, type ImagenSanity, type ProductoSanity, type Traducible } from "@/sanity/lib/tipos";
import { useTranslations, useLocale } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@/navigation";
import { etiquetaTipo, nombreProducto } from "@/app/[locale]/lib/producto-seo";
import { enviarEvento, itemAnalytics } from "@/app/[locale]/lib/analytics";

// --- Magnifier: Mantenido tal cual ---
const ZOOM = 2.4;
const LENS_PX = 132;

function getObjectContainRect(cw: number, ch: number, nw: number, nh: number) {
  if (nw <= 0 || nh <= 0 || cw <= 0 || ch <= 0) return { dw: cw, dh: ch, ox: 0, oy: 0 };
  const ir = nw / nh;
  const cr = cw / ch;
  if (ir > cr) {
    const dw = cw;
    const dh = cw / ir;
    return { dw, dh, ox: 0, oy: (ch - dh) / 2 };
  }
  const dh = ch;
  const dw = ch * ir;
  return { dw, dh, ox: (cw - dw) / 2, oy: 0 };
}

function MagnifierImage({ src, alt }: { src: string; alt: string }) {
  const [ready, setReady] = useState(false);
  const [lens, setLens] = useState({ show: false, lx: 0, ly: 0, bgX: 0, bgY: 0 });
  const [natural, setNatural] = useState({ w: 0, h: 0 });

  const updateLens = useCallback((img: HTMLImageElement, clientX: number, clientY: number) => {
    if (!ready || !natural.w || !natural.h) return;
    const r = img.getBoundingClientRect();
    const mx = clientX - r.left;
    const my = clientY - r.top;
    const { dw, dh, ox, oy } = getObjectContainRect(r.width, r.height, natural.w, natural.h);
    if (mx < ox || my < oy || mx > ox + dw || my > oy + dh) {
      setLens((s) => ({ ...s, show: false }));
      return;
    }
    const rx = (mx - ox) / dw;
    const ry = (my - oy) / dh;
    const sx = rx * natural.w;
    const sy = ry * natural.h;
    setLens({
      show: true,
      lx: mx - LENS_PX / 2,
      ly: my - LENS_PX / 2,
      bgX: -(sx * ZOOM - LENS_PX / 2),
      bgY: -(sy * ZOOM - LENS_PX / 2),
    });
  }, [ready, natural]);

  return (
    <div className="relative inline-block max-w-full">
      <img
        src={src} alt={alt}
        className="max-h-[min(78vh,720px)] w-auto max-w-full object-contain select-none"
        onLoad={(e) => { setReady(true); setNatural({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight }); }}
        onMouseMove={(e) => updateLens(e.currentTarget, e.clientX, e.clientY)}
        onMouseLeave={() => setLens((s) => ({ ...s, show: false }))}
      />
      {lens.show && ready && (
        <div className="pointer-events-none absolute z-10 rounded-full border-2 border-white shadow-xl"
          style={{ width: LENS_PX, height: LENS_PX, left: lens.lx, top: lens.ly, backgroundImage: `url(${src})`, backgroundSize: `${natural.w * ZOOM}px ${natural.h * ZOOM}px`, backgroundPosition: `${lens.bgX}px ${lens.bgY}px` }}
        />
      )}
    </div>
  );
}

// --- Componente Principal ---
export function ProductDetailClient({ producto }: { producto: ProductoSanity }) {
  const { addItem } = useCart();
  const t = useTranslations("DetalleCliente");
  const locale = useLocale();

  const getTrad = <T,>(campo?: Traducible<T>) => traducir(campo, locale) || "";

  const [selectedImage, setSelectedImage] = useState<ImagenSanity | null>(
    producto?.imagenes?.[0] || producto?.imagen || null
  );

  const [openImage, setOpenImage] = useState<string | null>(null);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const feedbackTimeoutRef = useRef<number | null>(null);

  const TELEFONO_TALLER = "34660800631";

  const nombreTraducido = nombreProducto(producto, locale);
  const categoria = etiquetaTipo(producto.tipo, "es");
  const itemGa = itemAnalytics(producto._id, nombreTraducido, producto.precio ?? 0, categoria);

  // GA4: vista de ficha (solo con consentimiento)
  useEffect(() => {
    enviarEvento("view_item", { currency: "EUR", value: producto.precio ?? 0, items: [itemGa], estado: producto.estado });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [producto._id]);

  function handleAddToCart() {
    const imagenUrl = producto.imagen?.asset ? urlFor(producto.imagen).width(200).height(200).fit("crop").auto("format").url() : "";
    addItem({
      id: producto._id,
      nombre: nombreTraducido,
      precio: producto.precio ?? 0,
      imagen: imagenUrl,
    });
    enviarEvento("add_to_cart", { currency: "EUR", value: producto.precio ?? 0, items: [itemGa] });
    setAddedFeedback(true);
    if (feedbackTimeoutRef.current) window.clearTimeout(feedbackTimeoutRef.current);
    feedbackTimeoutRef.current = window.setTimeout(() => setAddedFeedback(false), 1500);
  }

  // Contacto desde una pieza no disponible: es el principal resultado de la ficha mientras no hay venta
  const medirContacto = (via: string) => enviarEvento("generate_lead", { via, pieza: producto._id, estado: producto.estado });

  const textoWhatsappReservado = t.has("whatsapp.reservado") ? t("whatsapp.reservado", { nombre: nombreTraducido }) : "Hola, me interesa reservar " + nombreTraducido;
  const textoWhatsappVendido = t.has("whatsapp.vendido") ? t("whatsapp.vendido", { nombre: nombreTraducido }) : "Hola, me interesa el producto " + nombreTraducido;

  // Solo se muestran los datos que existen: nada de etiquetas vacías
  const base = getTrad(producto.materialBase);
  const pantallaObj = traducir(producto.materialPantalla, locale);
  const pantalla = pantallaObj ? [pantallaObj.tipo, pantallaObj.color ? `(${pantallaObj.color})` : ""].filter(Boolean).join(" ").trim() : "";
  const cableObj = traducir(producto.cable, locale);
  const cable = cableObj ? [cableObj.tipo, cableObj.color ? `(${cableObj.color})` : ""].filter(Boolean).join(" ").trim() : "";
  const medidas = (["ancho", "largo", "alto"] as const).filter((k) => typeof producto.medidas?.[k] === "number");
  const cuidados = getTrad(producto.cuidados).trim();
  const el = producto.electrico;
  const interruptor = traducir(el?.interruptor, locale);
  const datosElectricos = [
    el?.casquillo ? [t("casquillo"), el.casquillo] : null,
    typeof el?.potenciaMax === "number" ? [t("potencia"), `${el.potenciaMax} W`] : null,
    typeof el?.bombillaIncluida === "boolean" ? [t("bombilla"), el.bombillaIncluida ? t("bombillaSi") : t("bombillaNo")] : null,
    interruptor ? [t("interruptor"), interruptor] : null,
    typeof el?.longitudCable === "number" ? [t("longitudCable"), `${el.longitudCable} m`] : null,
  ].filter(Boolean) as [string, string][];

  const hayFichaTecnica = Boolean(base || pantalla || cable || medidas.length || datosElectricos.length || cuidados);

  const etiqueta = "text-stone-500 w-24 shrink-0 uppercase";
  const subtitulo = "text-[10px] uppercase tracking-wider text-stone-600 font-bold";

  return (
    <>
      <section className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          <div className="lg:sticky lg:top-24">
            <button onClick={() => selectedImage?.asset && setOpenImage(urlFor(selectedImage).width(2000).auto("format").url())} className="w-full rounded-2xl overflow-hidden bg-stone-100 ring-1 ring-stone-200/80">
              {selectedImage?.asset ? <img src={urlFor(selectedImage).width(1200).height(1500).fit("crop").auto("format").url()} alt={nombreTraducido} fetchPriority="high" loading="eager" decoding="async" className="w-full aspect-[4/5] object-cover" /> : <div className="w-full aspect-[4/5] flex items-center justify-center text-stone-500 text-sm">{t("sinImagen")}</div>}
            </button>
            {(producto.imagenes?.length ?? 0) > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {producto.imagenes?.map((img, index) => (
                  img?.asset && (
                    <button key={img._key || index} onClick={() => setSelectedImage(img)} className={`rounded-xl overflow-hidden ring-1 transition-all ${(selectedImage?.asset?._id ?? selectedImage?.asset?._ref) === (img.asset?._id ?? img.asset?._ref) ? "ring-stone-900" : "ring-stone-200 opacity-60"}`}>
                      <img src={urlFor(img).width(400).height(400).fit("crop").auto("format").url()} loading="lazy" alt={`${nombreTraducido} — ${t("miniaturaAlt")}`} className="w-full aspect-square object-cover" />
                    </button>
                  )
                ))}
              </div>
            )}
          </div>

          <div className="space-y-10">
            <div>
              <h1 className="text-4xl md:text-5xl font-nixie font-bold text-stone-900 mb-4">{nombreTraducido}</h1>
              <p className="text-2xl font-light text-stone-800 mb-2 font-urbanist">{producto?.precio}€</p>
              <p className="text-xs text-stone-600 mb-6 font-urbanist">
                {t("envioResumen")}{" "}
                <Link href="/envios-devoluciones" className="underline underline-offset-2 hover:text-stone-900">{t("envioMas")}</Link>
              </p>
              <p className="text-stone-600 leading-relaxed text-lg font-light">
                {getTrad(producto?.descripcionLarga) || getTrad(producto?.descripcion)}
              </p>
            </div>

            {hayFichaTecnica && (
            <div className="rounded-sm border-l-2 border-stone-800 bg-stone-100/50 p-6 space-y-6">
              <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-600">{t("compTecnica")}</h2>

              {(base || pantalla || cable) && (
                <div className="space-y-2">
                  <p className={subtitulo}>{t("materiales")}</p>
                  <ul className="space-y-1 font-mono text-xs text-stone-700">
                    {base && <li className="flex gap-4"><span className={etiqueta}>{t("base")}</span> {base}</li>}
                    {pantalla && <li className="flex gap-4"><span className={etiqueta}>{t("pantalla")}</span> {pantalla}</li>}
                    {cable && <li className="flex gap-4"><span className={etiqueta}>{t("cable")}</span> {cable}</li>}
                  </ul>
                </div>
              )}

              {medidas.length > 0 && (
                <div className="space-y-2">
                  <p className={subtitulo}>{t("dimensiones")} (cm)</p>
                  <ul className="space-y-1 font-mono text-xs text-stone-700">
                    {medidas.map((k) => (
                      <li key={k} className="flex gap-4"><span className={etiqueta}>{t(k)}</span> {producto.medidas?.[k]}</li>
                    ))}
                  </ul>
                </div>
              )}

              {datosElectricos.length > 0 && (
                <div className="space-y-2">
                  <p className={subtitulo}>{t("electrico")}</p>
                  <ul className="space-y-1 font-mono text-xs text-stone-700">
                    {datosElectricos.map(([k, v]) => (
                      <li key={k} className="flex gap-4"><span className={etiqueta}>{k}</span> {v}</li>
                    ))}
                  </ul>
                </div>
              )}

              {cuidados && (
                <div className="space-y-2">
                  <p className={subtitulo}>{t("cuidados")}</p>
                  <p className="font-mono text-xs text-stone-700 whitespace-pre-line">{cuidados}</p>
                </div>
              )}
            </div>
            )}

            <div className="pt-2 space-y-4">
              {producto?.estado !== 'disponible' && (
                <div className={`p-3 rounded-xl text-xs uppercase tracking-widest font-medium inline-block ${producto?.estado === 'reservado' ? 'bg-amber-50 text-amber-900' : 'bg-red-50 text-red-900'}`}>
                  {producto?.estado === 'reservado' ? t("status.reservado") : t("status.vendido")}
                </div>
              )}

              {producto?.estado === 'reservado' ? (
                <a href={`https://wa.me/${TELEFONO_TALLER}?text=${encodeURIComponent(textoWhatsappReservado)}`} target="_blank" rel="noopener noreferrer" onClick={() => medirContacto("whatsapp")} className="w-full md:w-auto inline-block text-center rounded-full bg-stone-900 text-stone-50 px-12 py-4 text-xs uppercase tracking-widest hover:bg-stone-800 transition-all">{t("botones.encargar")}</a>
              ) : producto?.estado === 'vendido' ? (
                <a href={`https://wa.me/${TELEFONO_TALLER}?text=${encodeURIComponent(textoWhatsappVendido)}`} target="_blank" rel="noopener noreferrer" onClick={() => medirContacto("whatsapp")} className="w-full md:w-auto inline-block text-center rounded-full bg-black text-white px-12 py-4 text-xs uppercase tracking-widest hover:bg-stone-800 hover:scale-[1.02] transition-all shadow-lg border border-transparent">{t("botones.solicitar")}</a>
              ) : (
                <button type="button" onClick={handleAddToCart} className={`w-full md:w-auto rounded-full px-12 py-4 text-xs uppercase tracking-widest transition-all ${addedFeedback ? "bg-stone-100 text-stone-500" : "bg-stone-900 text-stone-50 hover:bg-stone-800"}`}>
                  {addedFeedback ? t("botones.anadido") : t("botones.adquirir")}
                </button>
              )}

              {producto?.estado === 'reservado' && (
                <div className="rounded-sm border-l-2 border-amber-600 bg-amber-50/50 p-6 space-y-2">
                  <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-amber-900">{t("listaEspera.titulo")}</h3>
                  <p className="text-sm text-stone-700 leading-relaxed font-urbanist">{t("listaEspera.texto")}</p>
                  <Link href="/lamparas-a-medida" onClick={() => medirContacto("pagina_a_medida")} className="inline-block text-sm text-stone-900 underline underline-offset-2">{t("aMedida")}</Link>
                </div>
              )}

              {producto?.estado === 'vendido' && (
                <div className="rounded-sm border-l-2 border-stone-800 bg-stone-100 p-6 space-y-2">
                  <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-600">{t("proyectoMedida.titulo")}</h3>
                  <p className="text-sm text-stone-700 leading-relaxed font-urbanist">{t("proyectoMedida.texto")}</p>
                  <Link href="/lamparas-a-medida" onClick={() => medirContacto("pagina_a_medida")} className="inline-block text-sm text-stone-900 underline underline-offset-2">{t("aMedida")}</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {openImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm" onClick={() => setOpenImage(null)} />
          <div className="relative z-[101] w-full max-w-5xl bg-stone-50 rounded-2xl p-8 flex flex-col items-center">
            <MagnifierImage src={openImage} alt={nombreTraducido} />
            <button onClick={() => setOpenImage(null)} className="mt-4 text-xs uppercase tracking-widest font-bold text-stone-700">{t("cerrar")}</button>
          </div>
        </div>
      )}
    </>
  );
}
