import { defineArrayMember, defineField, defineType } from 'sanity';
import { bilingue, slugLimpio, textoAlternativo, tieneTexto } from './producto';

// Artículo del Journal: guías y relatos del taller. Pensado para buscadores y asistentes de IA:
// respuesta directa al principio, autor, fechas y piezas relacionadas.

// Cuerpo con formato: párrafos, subtítulos, citas, listas, negrita, cursiva, enlaces y fotos
const cuerpoIdioma = (titulo: string) => ({
  title: titulo,
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Párrafo', value: 'normal' },
        { title: 'Subtítulo', value: 'h2' },
        { title: 'Subtítulo menor', value: 'h3' },
        { title: 'Cita', value: 'blockquote' },
      ],
      lists: [
        { title: 'Lista', value: 'bullet' },
        { title: 'Lista numerada', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Negrita', value: 'strong' },
          { title: 'Cursiva', value: 'em' },
        ],
        annotations: [
          {
            name: 'link',
            title: 'Enlace',
            type: 'object',
            fields: [
              {
                name: 'href',
                title: 'Dirección',
                type: 'url',
                description: 'Para enlazar una pieza o una página de la web, pega su dirección completa (https://www.vetandlux.com/es/coleccion/…).',
                validation: (rule) => rule.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto'] }),
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
      fields: [
        textoAlternativo,
        bilingue('pie', 'Pie de foto', {
          description: 'Opcional: una frase que se ve bajo la foto («La veta del olivo, de cerca»).',
        }),
      ],
    }),
  ],
});

const contarPalabras = (texto: string) => texto.trim().split(/\s+/).filter(Boolean).length;

export const articulo = defineType({
  name: 'articulo',
  title: 'Artículo del Journal',
  type: 'document',
  fields: [
    bilingue('titulo', 'Título', {
      description: 'La pregunta o el tema tal como lo buscaría alguien: «Cómo elegir una lámpara de mesa para el salón».',
      validacionEs: (rule) => rule.required().error('El título en español es obligatorio'),
    }),
    defineField({
      name: 'slug',
      title: 'Dirección web',
      type: 'slug',
      description: 'Pulsa «Generar» después de escribir el título. No la cambies una vez publicado.',
      options: { source: 'titulo.es', slugify: slugLimpio, maxLength: 80 },
      validation: (rule) => rule.required().error('Pulsa «Generar» para crear la dirección web'),
    }),
    bilingue('resumen', 'Respuesta directa', {
      tipo: 'text',
      filas: 4,
      description: 'Responde a la pregunta del título en 40–80 palabras. Va al principio del artículo y en Google; es lo que suelen citar los asistentes de IA.',
      validacionEs: (rule) =>
        rule
          .custom((valor: unknown) => {
            if (!tieneTexto(valor)) return 'Escribe la respuesta directa';
            const palabras = contarPalabras(valor as string);
            return palabras < 40 || palabras > 80 ? `Tiene ${palabras} palabras: mejor entre 40 y 80` : true;
          })
          .warning(),
    }),
    defineField({
      name: 'imagen',
      title: 'Foto principal',
      type: 'image',
      description: 'Foto propia (del taller, de una pieza o de un ambiente). Se ve arriba del artículo y al compartirlo.',
      options: { hotspot: true },
      fields: [textoAlternativo],
    }),
    defineField({
      name: 'cuerpo',
      title: 'Artículo',
      type: 'object',
      description: 'Usa subtítulos para cada idea. El botón «Traducir al inglés» rellena la versión inglesa (la negrita y los enlaces hay que repasarlos a mano).',
      fields: [
        defineField({ name: 'es', ...cuerpoIdioma('Español') }),
        defineField({
          name: 'en',
          ...cuerpoIdioma('Inglés'),
          description: 'Sin versión inglesa, el artículo solo se publica en español.',
        }),
      ],
    }),
    defineField({
      name: 'autor',
      title: 'Autor',
      type: 'string',
      options: {
        list: ['Cristina', 'Rafa', 'Cristina y Rafa'],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'Cristina y Rafa',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publicado',
      title: 'Fecha de publicación',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'revisado',
      title: 'Fecha de revisión',
      type: 'datetime',
      description: 'Rellénala cuando actualices el contenido de forma importante.',
    }),
    defineField({
      name: 'piezas',
      title: 'Piezas relacionadas',
      type: 'array',
      description: 'Lámparas que encajan con el artículo (se muestran al final, mejor disponibles).',
      of: [{ type: 'reference', to: [{ type: 'producto' }] }],
      validation: (rule) => rule.max(4),
    }),
  ],
  orderings: [{ title: 'Más recientes', name: 'recientes', by: [{ field: 'publicado', direction: 'desc' }] }],
  preview: {
    select: { title: 'titulo.es', autor: 'autor', publicado: 'publicado', ingles: 'titulo.en', media: 'imagen' },
    prepare({ title, autor, publicado, ingles, media }) {
      const fecha = publicado ? new Date(publicado).toLocaleDateString('es-ES') : 'sin fecha';
      return { title: title || 'Sin título', subtitle: [autor, fecha, ingles ? 'ES + EN' : 'Solo ES'].filter(Boolean).join(' · '), media };
    },
  },
});
