"use client";

import { useCart } from "@/app/components/cart-provider";
import type { Producto } from "@/app/lib/productos";
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
export function ProductDetailClient({ producto }: { producto: Producto }) {
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(producto.imagenes[0] ?? producto.imagen);
  const [openImage, setOpenImage] = useState<string | null>(null);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const handleAddToCart = () => {
    addItem(producto);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1500);
  };

  return (
    <>
      <section className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Galería */}
          <div className="lg:sticky lg:top-24">
            <button onClick={() => setOpenImage(selectedImage)} className="w-full rounded-2xl overflow-hidden bg-stone-100 ring-1 ring-stone-200/80">
              <img src={selectedImage} alt={producto.nombre} className="w-full aspect-[4/5] object-cover" />
            </button>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {producto.imagenes.map((img) => (
                <button key={img} onClick={() => setSelectedImage(img)} className={`rounded-xl overflow-hidden ring-1 transition-all ${img === selectedImage ? "ring-stone-900" : "ring-stone-200 opacity-60"}`}>
                  <img src={img} alt="Miniatura" className="w-full aspect-square object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-10">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif italic text-stone-900 mb-4">{producto.nombre}</h1>
              <p className="text-2xl font-light text-stone-800 mb-6">{producto.precio}</p>
              <p className="text-stone-600 leading-relaxed text-lg font-light">{producto.descripcionLarga}</p>
            </div>

            <div className="space-y-6">
              {/* Ficha Técnica */}
              <div className="rounded-sm border-l-2 border-stone-800 bg-stone-100/50 p-6">
                <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500 mb-6">Composición Técnica</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-[9px] uppercase text-stone-400 font-bold">Materiales</p>
                    <ul className="space-y-1 font-mono text-xs text-stone-700">
                      <li className="flex gap-4"><span className="text-stone-400 w-16">BASE:</span> {producto.materialBase}</li>
                      {producto.materialPantalla && <li className="flex gap-4"><span className="text-stone-400 w-16">PANTALLA:</span> {producto.materialPantalla.tipo} ({producto.materialPantalla.color})</li>}
                      {producto.cable && <li className="flex gap-4"><span className="text-stone-400 w-16">CABLE:</span> {producto.cable.tipo} — {producto.cable.color}</li>}
                    </ul>
                  </div>
                  <div className="pt-4 border-t border-stone-200">
                    <p className="text-[9px] uppercase text-stone-400 font-bold">Dimensiones</p>
                    <ul className="space-y-1 font-mono text-xs text-stone-700">
                      {producto.medidas.map(m => <li key={m} className="flex gap-4"><span className="text-stone-400 w-16">SIZE:</span> {m}</li>)}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Cuidados */}
              <div className="rounded-3xl border border-stone-200 bg-white p-8">
                <h2 className="text-sm font-serif italic text-stone-800 mb-4">Preservación</h2>
                <ul className="space-y-3">
                  {producto.cuidados.map(c => <li key={c} className="text-stone-500 text-sm flex gap-3"><span className="text-amber-800/40">•</span>{c}</li>)}
                </ul>
              </div>
            </div>

            <button onClick={handleAddToCart} className={`w-full md:w-auto rounded-full px-12 py-4 text-xs uppercase tracking-widest transition-all ${addedFeedback ? "bg-stone-100 text-stone-400" : "bg-stone-900 text-stone-50 hover:bg-stone-800"}`}>
              {addedFeedback ? "Pieza Reservada" : "Adquirir Pieza Única"}
            </button>
          </div>
        </div>
      </section>

      {/* Modal Lupa */}
      {openImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm" onClick={() => setOpenImage(null)} />
          <div className="relative z-[101] w-full max-w-5xl bg-stone-50 rounded-2xl overflow-hidden p-8 flex flex-col items-center">
            <MagnifierImage src={openImage} alt="Zoom" />
            <button onClick={() => setOpenImage(null)} className="mt-4 text-xs uppercase tracking-widest font-bold">Cerrar</button>
          </div>
        </div>
      )}
    </>
  );
}