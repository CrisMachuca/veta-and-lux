import { jsonLdHtml } from "@/app/[locale]/lib/producto-seo";

export type Pregunta = { pregunta: string; respuesta: string };

// Preguntas frecuentes desplegables (sin JavaScript) con su marcado FAQPage, con el mismo texto visible
export function PreguntasFrecuentes({ titulo, preguntas, id = "preguntas-frecuentes" }: { titulo: string; preguntas: Pregunta[]; id?: string }) {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: preguntas.map((p) => ({
      "@type": "Question",
      name: p.pregunta,
      acceptedAnswer: { "@type": "Answer", text: p.respuesta },
    })),
  };

  return (
    <section aria-labelledby={id} className="px-6 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(faqJsonLd)} />
      <div className="max-w-3xl mx-auto">
        <h2 id={id} className="text-3xl md:text-4xl font-nixie text-[#3a3530] text-center mb-10">{titulo}</h2>
        <div className="divide-y divide-stone-200 border-y border-stone-200 font-urbanist">
          {preguntas.map((p) => (
            <details key={p.pregunta} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-base md:text-lg text-[#3a3530] [&::-webkit-details-marker]:hidden">
                {p.pregunta}
                <span aria-hidden="true" className="text-xl text-stone-500 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-[#5f5852] leading-relaxed">{p.respuesta}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
