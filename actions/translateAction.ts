// actions/translateAction.ts
import { DocumentActionComponent, DocumentActionProps, useClient } from 'sanity';

export const TranslateAction: DocumentActionComponent = (props: DocumentActionProps) => {
  const client = useClient({ apiVersion: '2026-06-18' });

  const handleTranslate = async () => {
    const doc = props.draft || props.published;
    if (!doc) return;

    const translate = async (text: string) => {
      if (!text) return text;
      try {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=es|en`;
        const res = await fetch(url);
        const data = await res.json();
        return data.responseData.translatedText;
      } catch (e) { return text; }
    };

    // Usamos ?.es || "" para evitar que el programa se detenga si algo no existe
    const patchData: any = {
      nombre: { es: doc.nombre?.es, en: await translate(doc.nombre?.es || "") },
      descripcion: { es: doc.descripcion?.es, en: await translate(doc.descripcion?.es || "") },
      descripcionLarga: { es: doc.descripcionLarga?.es, en: await translate(doc.descripcionLarga?.es || "") },
      materialBase: { es: doc.materialBase?.es, en: await translate(doc.materialBase?.es || "") },
      cuidados: { es: doc.cuidados?.es || "", en: await translate(doc.cuidados?.es || "") },
      materialPantalla: {
        en: {
          tipo: await translate(doc.materialPantalla?.es?.tipo || ""),
          color: await translate(doc.materialPantalla?.es?.color || "")
        }
      },
      cable: {
        en: {
          tipo: await translate(doc.cable?.es?.tipo || ""),
          color: await translate(doc.cable?.es?.color || "")
        }
      }
    };

    try {
      await client.patch(doc._id).set(patchData).commit();
      props.onComplete();
      alert("¡Traducción aplicada!");
    } catch (err) {
      console.error(err);
      alert("Error: Limpia los campos antiguos del documento.");
    }
  };

  return { label: 'Traducir todo (Auto)', onHandle: handleTranslate };
};