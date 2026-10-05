"use client";

import { useCart } from "@/app/[locale]/components/cart-provider";
import { urlFor } from "@/sanity/lib/client"; 
import { Link } from "@/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useHaMontado } from "@/app/[locale]/lib/use-ha-montado";
import { traducir, type ProductoSanity } from "@/sanity/lib/tipos";
import Image from "next/image";

export function ProductGallery({ productos, isHome = false }: { productos: ProductoSanity[], isHome?: boolean }) {
  const { addItem, lines } = useCart();
  const t = useTranslations("Gallery");
  const locale = useLocale();
  
  const isMounted = useHaMontado();

  function handleAdd(producto: ProductoSanity) {
    const imagenUrl = (producto.imagen?.asset) ? urlFor(producto.imagen).width(200).height(200).fit("crop").auto("format").url() : "";
    
    const productoMapeado = {
      id: producto._id,
      nombre: traducir(producto.nombre, locale) || "Producto",
      precio: producto.precio ?? 0,
      imagen: imagenUrl,
    };

    addItem(productoMapeado);
  }

  return (
    <div className={`${isHome ? "flex md:grid md:grid-cols-3 gap-4 md:gap-12 overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-hide pb-4" : "grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-12"}`}>
      {productos.map((producto, index) => {
        const slugNormalizado = typeof producto.slug === 'string' 
          ? producto.slug 
          : producto.slug?.current;

        const isAdded = isMounted && lines.some(l => l.productId === producto._id);
        const isDisabled = !isMounted || producto.estado === "vendido" || producto.estado === "reservado" || isAdded;

        // URL optimizada desde Sanity con WebP/AVIF automático y un tamaño base sensato
        const sanityImageUrl = producto.imagen?.asset 
          ? urlFor(producto.imagen).width(600).height(750).fit("crop").auto("format").url() 
          : "";

        return (
          <article key={producto._id} className={`group flex flex-col h-full ${isHome ? "flex-none w-[75vw] md:w-auto snap-start" : ""}`}>
            <Link href={`/coleccion/${slugNormalizado}`} className="block rounded-xl md:rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-800">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl md:rounded-2xl bg-stone-100 ring-1 ring-stone-200/50 shadow-sm transition-all duration-500 group-hover:shadow-md">
                
                {producto.imagen?.asset ? (
                  <Image 
                    src={sanityImageUrl}
                    alt={traducir(producto.nombre, locale) || "Producto"} 
                    fill
                    sizes="(max-width: 768px) 75vw, (max-width: 1200px) 33vw, 400px"
                    className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]" 
                    loading={isHome && index < 2 ? "eager" : "lazy"}
                    priority={isHome && index === 0}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400 text-[10px] md:text-xs">{t("sin_imagen")}</div>
                )}
                
                {producto.estado && producto.estado !== "disponible" && (
                  <div className={`absolute top-3 left-3 md:top-4 md:left-4 px-3 py-1 backdrop-blur-md border text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold shadow-sm z-10 ${producto.estado === "reservado" ? "bg-amber-50/80 border-amber-200 text-amber-900" : "bg-white/70 border-white/50 text-stone-900"}`}>
                    {producto.estado === "reservado" ? t("estado_reservado") : t("estado_vendido")}
                  </div>
                )}
              </div>
            </Link>

            <div className="mt-4 flex flex-col flex-grow justify-between px-0.5">
              <div className="min-w-0">
                <h3 className="text-[11px] sm:text-xl font-bold text-stone-950 font-nixie leading-tight">
                  {traducir(producto.nombre, locale)}
                </h3>
                
                <p className="hidden sm:block text-stone-500 mt-2 text-sm line-clamp-2 font-urbanist min-h-[2.5em]">
                  {traducir(producto.descripcion, locale)}
                </p>
              </div>
              
              <div className="mt-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                <div className="flex flex-col gap-2 text-[10px] md:text-xs uppercase tracking-[0.2em] font-urbanist font-bold">
                  <Link href={`/coleccion/${slugNormalizado}`} className="text-stone-500 hover:text-stone-950 transition-colors underline underline-offset-4 w-fit">
                    {t("detalles")}
                  </Link>
                  
                  <button
                    type="button"
                    disabled={isDisabled}
                    onClick={() => handleAdd(producto)}
                    className={`px-4 py-2 rounded-full border transition-all duration-300 w-fit ${
                      isDisabled 
                        ? "border-stone-200 text-stone-400 bg-stone-50 cursor-not-allowed" 
                        : "border-stone-800 text-stone-900 hover:bg-stone-900 hover:text-white cursor-pointer"
                    }`}
                  >
                    {!isMounted 
                      ? t("anadir") 
                      : producto.estado === "vendido" ? t("agotado") : producto.estado === "reservado" ? t("reservado") : isAdded ? t("anadido") : t("anadir")
                    }
                  </button>
                </div>
                
                <span className="text-[13px] sm:text-[18px] font-medium text-stone-900 tracking-[0.05em] font-urbanist tabular-nums shrink-0">
                  {producto.precio?.toLocaleString()}
                  <span className="text-[10px] ml-0.5 opacity-50 font-normal">EUR</span>
                </span>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}