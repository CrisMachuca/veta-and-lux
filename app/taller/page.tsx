import Link from "next/link";

export default function TallerPage() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-800">
      <section className="max-w-5xl mx-auto px-6 pt-16 md:pt-20 pb-12">
        <div className="mb-10">
          <Link
            href="/"
            className="text-sm uppercase tracking-widest text-stone-500 hover:text-stone-800 transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>

        <div className="max-w-3xl space-y-5">
          <span className="text-sm uppercase tracking-widest text-stone-500">
            Conoce nuestro taller
          </span>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-stone-900">
            Del río a tu mesa: tres momentos de nuestro proceso
          </h1>
          <p className="text-stone-600 leading-relaxed text-lg">
            Cada lámpara empieza lejos del taller: en la búsqueda paciente de
            troncos que el agua y el tiempo han esculpido. Luego llegan a
            nuestro espacio de trabajo, donde las convertimos en piezas de luz, y
            terminan con un acabado cuidadoso que realza la madera sin
            enmascarar su historia.
          </p>
        </div>
      </section>

      {/* 1. Búsqueda — troncos en el río */}
      <section className="max-w-5xl mx-auto px-6 pb-16 md:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
          <div className="order-2 md:order-1 space-y-5">
            <span className="text-xs uppercase tracking-widest text-amber-800/80">
              Origen
            </span>
            <h2 className="text-2xl md:text-3xl font-light text-stone-900 tracking-tight">
              Búsqueda junto al río
            </h2>
            <p className="text-stone-600 leading-relaxed">
              Recorremos orillas y cauces donde la madera aparece sola: piezas
              arrastradas por la corriente, atrapadas entre piedras o
              semiocultas bajo el agua clara. Elegimos troncos con forma,
              densidad y carácter; no buscamos trozos perfectos, sino los que
              merecen una segunda vida como luz.
            </p>
            <p className="text-stone-600 leading-relaxed text-sm">
              Ese primer encuentro —persona, río y madera— marca el tono de cada
              pieza: orgánica, honesta y única.
            </p>
          </div>
          <div className="order-1 md:order-2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-stone-100 ring-1 ring-stone-200/80 shadow-sm">
              <img
                src="/busqueda.png"
                alt="Búsqueda de troncos recuperados en el río"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-stone-950/10 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Taller — espacio de trabajo */}
      <section className="border-t border-stone-200/80 bg-stone-100/40">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
            <div>
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-stone-100 ring-1 ring-stone-200/80 shadow-sm">
                <img
                  src="/taller.png"
                  alt="Interior del taller de Veta y Lux"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-stone-950/10 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-5">
              <span className="text-xs uppercase tracking-widest text-amber-800/80">
                Creación
              </span>
              <h2 className="text-2xl md:text-3xl font-light text-stone-900 tracking-tight">
                En el taller, la madera toma forma
              </h2>
              <p className="text-stone-600 leading-relaxed">
                Aquí secamos, estabilizamos y trabajamos cada pieza con calma:
                cortes que respetan la veta, ensayos de proporción y el encaje
                de la luz. El taller es nuestro refugio de polvo suave, herramientas
                alineadas y silencio concentrado —el lugar donde el tronco del río
                empieza a parecerse a una lámpara.
              </p>
              <p className="text-stone-600 leading-relaxed text-sm">
                Cada mesa y cada pared del espacio guardan el rastro de piezas
                anteriores; el ambiente es tan parte del proceso como el cincel
                o la lija.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Acabado — aceite al tronco */}
      <section className="max-w-5xl mx-auto px-6 py-16 md:py-20 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
          <div className="space-y-5">
            <span className="text-xs uppercase tracking-widest text-amber-800/80">
              Último toque
            </span>
            <h2 className="text-2xl md:text-3xl font-light text-stone-900 tracking-tight">
              Acabado con aceite: calidez que se ve y se toca
            </h2>
            <p className="text-stone-600 leading-relaxed">
              El acabado es un ritual: extendemos aceites naturales a mano para
              nutrir la fibra, realzar el dibujo del tronco y proteger la pieza
              sin barnices fríos. La madera oscurece un poco, se unifica, y al
              mismo tiempo “despierta” —cada roce de trapo deja la superficie
              más viva y acogedora.
            </p>
            <p className="text-stone-600 leading-relaxed text-sm">
              Así cerramos el círculo: del agua del río al aceite que la
              abriga, hasta que la lámpara está lista para iluminar tu hogar.
            </p>
          </div>
          <div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-stone-100 ring-1 ring-stone-200/80 shadow-sm">
              <img
                src="/acabado.png"
                alt="Aplicación de aceite natural al tronco en acabado artesanal"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-stone-950/10 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
