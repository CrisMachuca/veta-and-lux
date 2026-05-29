import Link from "next/link";
import { SiteNav } from "@/app/[locale]/components/site-nav";
import { SiteFooter } from "@/app/[locale]/components/site-footer";

export default function ElProcesoPage() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-800 antialiased">
      <SiteNav />

      {/* Cabecera Editorial */}
      <header className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
        <p className="text-[10px] uppercase tracking-[0.4em] text-stone-400 font-bold mb-4">
          La Filosofía del Elogio a la Madera
        </p>
        <h1 className="text-4xl md:text-6xl font-serif italic text-stone-900 font-light leading-tight">
          Del secreto de la naturaleza <br />a la calidez del hogar
        </h1>
        <p className="max-w-xl mx-auto mt-6 text-stone-500 font-light text-sm md:text-base leading-relaxed">
          Cada lámpara de Veta & Lux no se fabrica; se escucha y se libera. Seguimos un proceso honesto, pausado y profundamente respetuoso con los ciclos del tiempo.
        </p>
        <div className="w-12 h-[1px] bg-stone-300 mx-auto mt-10"></div>
      </header>

      {/* Cronología del Proceso en detalle */}
      <section className="max-w-4xl mx-auto px-6 pb-32 space-y-24 md:space-y-36">
        
        {/* 🎥 PASO 1: El Origen */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          <div className="md:col-span-7 bg-stone-100 aspect-[4/3] rounded-sm relative overflow-hidden shadow-sm flex items-center justify-center">
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover filter brightness-[0.95]"
            >
              <source src="/hallazgo.mp4" type="video/mp4" />
              Tu navegador no soporta la reproducción de vídeos.
            </video>
            <div className="absolute inset-0 border-[12px] border-stone-50/10 m-4 rounded-sm pointer-events-none"></div>
          </div>
          <div className="md:col-span-5 space-y-4">
            <p className="font-mono text-xs text-amber-800/60 uppercase tracking-widest font-bold">Fase 01 // El Origen</p>
            <h2 className="text-2xl md:text-3xl font-serif text-stone-900 font-light">El Hallazgo Ético</h2>
            <p className="text-stone-600 font-light text-sm leading-relaxed">
              Nuestra materia prima no proviene de la tala comercial. Buscamos piezas con historia: maderas a la deriva esculpidas por el salitre en la costa o ramas caídas en bosques antiguos procedentes de podas controladas y totalmente legales.
            </p>
            <p className="text-stone-600 font-light text-sm leading-relaxed">
              Buscamos maderas que ya han vivido, prestando especial atención a sus nudos y cicatrices. El vídeo evoca el entorno natural donde nace cada historia.
            </p>
          </div>
        </div>

        {/* ⏳ PASO 2: El Letargo */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          <div className="md:col-span-7 md:order-2 bg-stone-100 aspect-[4/3] rounded-sm relative overflow-hidden shadow-sm">
            <img
              src="/curado.png"
              alt="Madera recuperada en proceso de curado y secado natural"
              className="w-full h-full object-cover filter brightness-[0.98]"
            />
          </div>
          <div className="md:col-span-5 md:order-1 space-y-4">
            <p className="font-mono text-xs text-amber-800/60 uppercase tracking-widest font-bold">Fase 02 // El Tiempo</p>
            <h2 className="text-2xl md:text-3xl font-serif text-stone-900 font-light">El Letargo y Curado</h2>
            <p className="text-stone-600 font-light text-sm leading-relaxed">
              La madera viva retiene humedad y tensiones. Al llegar al taller, cada pieza inicia un periodo de reposo absoluto que puede durar meses en nuestro espacio.
            </p>
            <p className="text-stone-600 font-light text-sm leading-relaxed">
              Se estabilizan de forma natural, permitiendo que la fibra se asiente. Es un ejercicio de paciencia donde determinamos si la estructura es apta para albergar la luz y perdurar durante generaciones.
            </p>
          </div>
        </div>

        {/* ✨ PASO 3: Saneado y Escultura */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          <div className="md:col-span-7 bg-stone-100 aspect-[4/3] rounded-sm relative overflow-hidden shadow-sm">
            <img
              src="/saneado.jpeg"
              alt="Madera recuperada pulida meticulosamente y herramientas en el banco de trabajo"
              className="w-full h-full object-cover filter brightness-[0.98]"
            />
          </div>
          <div className="md:col-span-5 space-y-4">
            <p className="font-mono text-xs text-amber-800/60 uppercase tracking-widest font-bold">Fase 03 // El Respeto</p>
            <h2 className="text-2xl md:text-3xl font-serif text-stone-900 font-light">Saneado y Escultura</h2>
            <p className="text-stone-600 font-light text-sm leading-relaxed">
              Retiramos las partes debilitadas de forma manual mediante cepillos y gubias, respetando estrictamente la corteza sana, las texturas y las grietas estables que otorgan carácter a la pieza.
            </p>
            <p className="text-stone-600 font-light text-sm leading-relaxed">
              Tratamos la madera mediante técnicas no invasivas y aplicamos aceites orgánicos texturizados a mano hasta alcanzar un grano 1000, nutriendo el poro sin ocultar el tacto puro y marmóleo de la madera.
            </p>
          </div>
        </div>

        {/* 💡 PASO 4: Arquitectura Lumínica */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          <div className="md:col-span-7 md:order-2 bg-stone-100 aspect-[4/3] rounded-sm relative overflow-hidden shadow-sm">
            <img
              src="/tronco2.jpeg"
              alt="Componentes de latón cepillado, cables de lino y ensamblaje de la lámpara"
              className="w-full h-full object-cover filter brightness-[0.98]"
            />
          </div>
          <div className="md:col-span-5 md:order-1 space-y-4">
            <p className="font-mono text-xs text-amber-800/60 uppercase tracking-widest font-bold">Fase 04 // La Unión</p>
            <h2 className="text-2xl md:text-3xl font-serif text-stone-900 font-light">Arquitectura Lumínica</h2>
            <p className="text-stone-600 font-light text-sm leading-relaxed">
              Una lámpara premium requiere una electrónica impecable. Diseñamos las canalizaciones internas ocultas de forma milimétrica para no alterar la estética orgánica del tronco.
            </p>
            <p className="text-stone-600 font-light text-sm leading-relaxed">
              Utilizamos exclusivamente cables con sutiles fundas de lino o algodón textil, portalámparas de latón macizo y sistemas eléctricos que cumplen los más estrictos estándares de seguridad europeos.
            </p>
          </div>
        </div>

        {/* Cierre / Manifiesto */}
        <div className="bg-stone-900 text-stone-100 p-8 md:p-16 rounded-sm text-center space-y-6 max-w-3xl mx-auto shadow-md">
          <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400 font-mono">El Manifiesto Veta & Lux</p>
          <blockquote className="font-serif italic text-xl md:text-2xl text-stone-200 font-light max-w-xl mx-auto leading-relaxed">
            "No creamos dos piezas iguales porque la naturaleza jamás repite el mismo trazo. Llevar una de nuestras lámparas a su espacio es adoptar un fragmento de tiempo suspendido."
          </blockquote>
          <div className="pt-4">
            <Link
              href="/coleccion"
              className="inline-block border-b border-stone-500 text-stone-300 hover:text-white hover:border-white transition-colors text-xs uppercase tracking-widest pb-1 font-mono"
            >
              Explorar la colección actual →
            </Link>
          </div>
        </div>

      </section>

      <SiteFooter />
    </main>
  );
}