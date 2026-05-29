"use client";

import { useCart } from "@/app/[locale]/components/cart-provider";
import { urlFor } from "@/sanity/lib/client";
import { useCallback, useEffect, useRef, useState } from "react";

// --- Constantes y Utilidades (Magnifier) ---
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
        <div
          className="pointer-events-none absolute z-10 rounded-full border-2 border-white shadow-xl"
          style={{
            width: LENS_PX, height: LENS_PX, left: lens.lx, top: lens.ly,
            backgroundImage: `url(${src})`, backgroundSize: `${natural.w * ZOOM}px ${natural.h * ZOOM}px`,
            backgroundPosition: `${lens.bgX}px ${lens.bgY}px`,
          }}
        />
      )}
    </div>
  );
}

// --- Componente Principal ---
export function ProductDetailClient({ producto }: { producto: any }) {
  const { addItem } = useCart();
  
  const [selectedImage, setSelectedImage] = useState(
    producto.imagenes && producto.imagenes.length > 0 
      ? producto.imagenes[0] 
      : producto.imagen
  );
  
  const [openImage, setOpenImage] = useState<string | null>(null);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const feedbackTimeoutRef = useRef<number | null>(null);

  // 📝 Configura aquí el teléfono del taller (con código de país, ej: 34600000000)
  const TELEFONO_TALLER = "34660800631"; 

  function handleAddToCart() {
    const imagenUrl = producto.imagen ? urlFor(producto.imagen).url() : "";

    const productoMapeado = {
      ...producto,
      id: producto._id || producto.id, // Soportamos ambos casos de mapeo dinámico
      imagen: imagenUrl,               // URL de texto plano optimizada desde Sanity
    };
    
    addItem(productoMapeado);
    setAddedFeedback(true);
    
    if (feedbackTimeoutRef.current) {
      window.clearTimeout(feedbackTimeoutRef.current);
    }
    feedbackTimeoutRef.current = window.setTimeout(() => {
      setAddedFeedback(false);
    }, 1500);
  }

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) {
        window.clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, []);

  const esImagenSeleccionada = (img: any) => {
    if (!selectedImage || !img) return false;
    if (selectedImage.asset?._ref && img.asset?._ref) {
      return selectedImage.asset._ref === img.asset._ref;
    }
    return selectedImage === img;
  };

  return (
    <>
      <section className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Galería */}
          <div className="lg:sticky lg:top-24">
            <button 
              onClick={() => setOpenImage(selectedImage ? urlFor(selectedImage).url() : null)} 
              className="w-full rounded-2xl overflow-hidden bg-stone-100 ring-1 ring-stone-200/80"
            >
              {selectedImage ? (
                <img 
                  src={urlFor(selectedImage).url()} 
                  alt={producto.nombre} 
                  className="w-full aspect-[4/5] object-cover" 
                />
              ) : (
                <div className="w-full aspect-[4/5] flex items-center justify-center text-stone-400 text-sm">
                  Sin imagen disponible
                </div>
              )}
            </button>
            
            {producto.imagenes && producto.imagenes.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {producto.imagenes.map((img: any, index: number) => {
                  const isSelected = esImagenSeleccionada(img);
                  return (
                    <button 
                      key={img._key || index} 
                      onClick={() => setSelectedImage(img)} 
                      className={`rounded-xl overflow-hidden ring-1 transition-all ${
                        isSelected ? "ring-stone-900" : "ring-stone-200 opacity-60"
                      }`}
                    >
                      <img 
                        src={urlFor(img).url()} 
                        alt="Miniatura" 
                        className="w-full aspect-square object-cover" 
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-10">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif italic text-stone-900 mb-4">
                {producto.nombre}
              </h1>
              <p className="text-2xl font-light text-stone-800 mb-6">
                {producto.precio}
              </p>
              <p className="text-stone-600 leading-relaxed text-lg font-light">
                {producto.descripcionLarga || producto.descripcion}
              </p>
            </div>

            <div className="space-y-6">
              {/* Ficha Técnica */}
              <div className="rounded-sm border-l-2 border-stone-800 bg-stone-100/50 p-6">
                <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500 mb-6">
                  Composición Técnica
                </h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-[9px] uppercase text-stone-400 font-bold">Materiales</p>
                    <ul className="space-y-1 font-mono text-xs text-stone-700">
                      <li className="flex gap-4">
                        <span className="text-stone-400 w-16">BASE:</span> {producto.materialBase}
                      </li>
                      {producto.materialPantalla?.tipo && (
                        <li className="flex gap-4">
                          <span className="text-stone-400 w-16">PANTALLA:</span> {producto.materialPantalla.tipo} ({producto.materialPantalla.color})
                        </li>
                      )}
                      {producto.cable?.tipo && (
                        <li className="flex gap-4">
                          <span className="text-stone-400 w-16">CABLE:</span> {producto.cable.tipo} — {producto.cable.color}
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  {producto.medidas && producto.medidas.length > 0 && (
                    <div className="pt-4 border-t border-stone-200">
                      <p className="text-[9px] uppercase text-stone-400 font-bold">Dimensiones</p>
                      <ul className="space-y-1 font-mono text-xs text-stone-700">
                        {producto.medidas.map((m: string) => (
                          <li key={m} className="flex gap-4">
                            <span className="text-stone-400 w-16">SIZE:</span> {m}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Cuidados */}
              {producto.cuidados && producto.cuidados.length > 0 && (
                <div className="rounded-3xl border border-stone-200 bg-white p-8">
                  <h2 className="text-sm font-serif italic text-stone-800 mb-4">Preservación</h2>
                  <ul className="space-y-3">
                    {producto.cuidados.map((c: string) => (
                      <li key={c} className="text-stone-500 text-sm flex gap-3">
                        <span className="text-amber-800/40">•</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* 🔥 Sección Comercial de Compra y Captación de Encargos Personalizados */}
            <div className="pt-2 space-y-4">
              
              {/* Etiquetas de aviso */}
              {producto.estado && producto.estado !== 'disponible' && (
                <div className={`p-3 rounded-xl text-xs uppercase tracking-widest font-medium inline-block ${
                  producto.estado === 'reservado' 
                    ? 'bg-amber-50 text-amber-800 border border-amber-200/60' 
                    : 'bg-red-50 text-red-800 border border-red-200/60'
                }`}>
                  {producto.estado === 'reservado' 
                    ? '💡 Esta pieza única de colección está reservada temporalmente' 
                    : '🔴 Esta pieza única ya ha sido adquirida'}
                </div>
              )}

              {/* Botón condicional según estado en Sanity */}
              {producto.estado === 'reservado' ? (
                /* CASO RESERVADO: Envía un WhatsApp automático preguntando por encargar una similar */
                <a
                  href={`https://wa.me/${TELEFONO_TALLER}?text=¡Hola!%20He%20visto%20la%20lámpara%20"${encodeURIComponent(producto.nombre)}"%20en%20la%20web%20y%20veo%20que%20está%20reservada.%20¿Podríamos%20hablar%20para%20encargar%20una%20pieza%20similar%20en%20el%20taller?`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto inline-block text-center rounded-full bg-stone-900 text-stone-50 px-12 py-4 text-xs uppercase tracking-widest hover:bg-stone-800 transition-all font-medium shadow-sm"
                >
                  Encargar una pieza similar →
                </a>
              ) : producto.estado === 'vendido' ? (
                /* CASO VENDIDO: Invita a pedir un proyecto a medida inspirado en el modelo agotado */
                <a
                  href={`https://wa.me/${TELEFONO_TALLER}?text=¡Hola!%20Me%20ha%20encantado%20la%20lámpara%20"${encodeURIComponent(producto.nombre)}"%20pero%20veo%20que%20ya%20está%20agotada.%20¿Es%20posible%20hacer%20un%20proyecto%20a%20medida%20inspirado%20en%20ella?`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto inline-block text-center rounded-full bg-stone-100 text-stone-800 border border-stone-300 px-12 py-4 text-xs uppercase tracking-widest hover:bg-stone-200 transition-all font-medium"
                >
                  Solicitar proyecto a medida
                </a>
              ) : (
                /* CASO DISPONIBLE: Flujo de compra normal del e-commerce */
                <button 
                  type="button"
                  onClick={handleAddToCart} 
                  className={`w-full md:w-auto rounded-full px-12 py-4 text-xs uppercase tracking-widest transition-all ${
                    addedFeedback 
                      ? "bg-stone-100 text-stone-400" 
                      : "bg-stone-900 text-stone-50 hover:bg-stone-800 cursor-pointer shadow-sm"
                  }`}
                >
                  {addedFeedback ? "Pieza Añadida ✓" : "Adquirir Pieza Única"}
                </button>
              )}

              {/* Bloque informativo de Lista de Espera (Solo visible si el producto está reservado) */}
              {producto.estado === 'reservado' && (
                <div className="mt-4 p-4 rounded-xl border border-stone-200/60 bg-stone-50/50 text-xs text-stone-600 space-y-2 max-w-md leading-relaxed">
                  <p className="font-medium text-stone-800">¿Te interesa esta lámpara?</p>
                  <p>
                    Las reservas de piezas únicas suelen mantenerse activas durante un máximo de 48 horas a la espera del pago. Si deseas entrar en la <strong>lista de espera prioritaria</strong> por si vuelve a quedar libre, o si prefieres que busquemos una madera similar en el taller para ti, escríbenos directamente.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Modal Lupa Avanzada */}
      {openImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm" onClick={() => setOpenImage(null)} />
          <div className="relative z-[101] w-full max-w-5xl bg-stone-50 rounded-2xl overflow-hidden p-8 flex flex-col items-center">
            <MagnifierImage src={openImage} alt={producto.nombre} />
            <button 
              onClick={() => setOpenImage(null)} 
              className="mt-4 text-xs uppercase tracking-widest font-bold text-stone-700 hover:text-stone-900 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}