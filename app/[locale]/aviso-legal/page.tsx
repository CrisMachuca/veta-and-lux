import { SiteNav } from "@/app/[locale]/components/site-nav";
import { SiteFooter } from "@/app/[locale]/components/site-footer";

export default function AvisoLegalPage() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-800 antialiased">
      <SiteNav />

      {/* Cabecera de la Página */}
      <header className="max-w-4xl mx-auto px-6 pt-20 pb-12 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400 font-bold mb-3">
          Transparencia y Rigor
        </p>
        <h1 className="text-4xl md:text-5xl font-serif italic text-stone-900 font-light">
          Aviso Legal
        </h1>
        <div className="w-12 h-[1px] bg-stone-300 mx-auto mt-8"></div>
      </header>

      {/* Contenido Principal */}
      <section className="max-w-3xl mx-auto px-6 pb-24 space-y-12 text-stone-600 font-light leading-relaxed text-sm">
        
        <p className="text-base text-stone-700">
          En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSI-CE), se exponen a continuación los datos identificativos del titular de este sitio web dedicado a la alta artesanía lumínica.
        </p>

        {/* 1. Datos Identificativos */}
        <div className="space-y-3 pt-4">
          <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-900 font-sans">
            1. Titularidad del Sitio Web
          </h2>
          <div className="rounded-sm border border-stone-200 bg-white p-6 font-mono text-xs text-stone-700 space-y-2">
            <p><span className="text-stone-400 mr-2">DENOMINACIÓN:</span> Veta & Lux</p>
            <p><span className="text-stone-400 mr-2">TITULAR:</span> [Tu Nombre Completo]</p>
            <p><span className="text-stone-400 mr-2">N.I.F. / C.I.F.:</span> [Tu DNI o CIF]</p>
            <p><span className="text-stone-400 mr-2">DOMICILIO SOCIAL:</span> [Tu Dirección Postal, Ciudad, España]</p>
            <p><span className="text-stone-400 mr-2">CONTACTO:</span> info@vetandlux.com</p>
            <p><span className="text-stone-400 mr-2">TELÉFONO:</span> +34 660 80 06 31</p>
          </div>
        </div>

        {/* 2. Propiedad Intelectual */}
        <div className="space-y-3">
          <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-900 font-sans">
            2. Propiedad Intelectual y del Arte
          </h2>
          <p>
            El diseño del portal y sus códigos fuente, así como los logotipos, marcas, textos, fotografías y diseños de las lámparas artesanales expuestas, pertenecen a <strong>Veta & Lux</strong> o a sus respectivos autores y están protegidos por los correspondientes derechos de propiedad intelectual e industrial.
          </p>
          <p>
            Queda estrictamente prohibida la reproducción total o parcial, explotación, distribución o comercialización de cualquier contenido de esta web, así como de los diseños escultóricos propios del taller, sin la autorización previa y por escrito de la dirección de Veta & Lux.
          </p>
        </div>

        {/* 3. Responsabilidad */}
        <div className="space-y-3">
          <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-900 font-sans">
            3. Limitación de Responsabilidad
          </h2>
          <p>
            Veta & Lux no se hace responsable de los daños y perjuicios de cualquier naturaleza que pudieran ocasionar errores u omisiones en los contenidos, falta de disponibilidad del portal o la transmisión de programas maliciosos, a pesar de haber adoptado todas las medidas tecnológicas premium necesarias para evitarlo.
          </p>
          <p>
            Dada la naturaleza única y orgánica de las piezas vendidas (madera noble tratada artesanalmente), las imágenes e informaciones técnicas se aproximan con el máximo rigor posible a la realidad de la obra, si bien cada lámpara presenta nudos, vetas y matices exclusivos inherentes a su condición escultórica.
          </p>
        </div>

        {/* 4. Enlaces Externos */}
        <div className="space-y-3">
          <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-900 font-sans">
            4. Política de Enlaces
          </h2>
          <p>
            En el caso de que en este sitio web se dispusiesen enlaces o hipervínculos hacia otros sitios de Internet, Veta & Lux no ejercerá ningún tipo de control sobre dichos sitios y contenidos. En ningún caso asumirá responsabilidad alguna por los contenidos de algún enlace perteneciente a un sitio web ajeno.
          </p>
        </div>

        {/* 5. Legislación */}
        <div className="space-y-3">
          <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-900 font-sans">
            5. Legislación Aplicable y Jurisdicción
          </h2>
          <p>
            Para la resolución de todas las controversias o cuestiones relacionadas con el presente sitio web o de las actividades en él desarrolladas, será de aplicación la legislación española, a la que se someten expresamente las partes, siendo competentes para la resolución de todos los conflictos derivados o relacionados con su uso los Juzgados y Tribunales más cercanos al domicilio social del taller.
          </p>
        </div>

      </section>

      <SiteFooter />
    </main>
  );
}