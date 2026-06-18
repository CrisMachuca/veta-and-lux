import { defineField, defineType } from 'sanity';

export const producto = defineType({
  name: 'producto',
  title: 'Productos (Lámparas)',
  type: 'document',
  fields: [
    // --- CAMPOS MULTILINGÜES (Traducibles) ---
    { name: 'nombre', title: 'Nombre', type: 'object', fields: [{ name: 'es', type: 'string' }, { name: 'en', type: 'string' }] },
    { name: 'descripcion', title: 'Descripción Corta', type: 'object', fields: [{ name: 'es', type: 'string' }, { name: 'en', type: 'string' }] },
    { name: 'descripcionLarga', title: 'Descripción Larga', type: 'object', fields: [{ name: 'es', type: 'text' }, { name: 'en', type: 'text' }] },
    { name: 'materialBase', title: 'Material de la Base', type: 'object', fields: [{ name: 'es', type: 'string' }, { name: 'en', type: 'string' }] },
    {
      name: 'materialPantalla', title: 'Material de la Pantalla', type: 'object',
      fields: [
        { name: 'es', type: 'object', fields: [{ name: 'tipo', type: 'string' }, { name: 'color', type: 'string' }] },
        { name: 'en', type: 'object', fields: [{ name: 'tipo', type: 'string' }, { name: 'color', type: 'string' }] }
      ]
    },
    {
      name: 'cable', title: 'Detalles del Cable', type: 'object',
      fields: [
        { name: 'es', type: 'object', fields: [{ name: 'tipo', type: 'string' }, { name: 'color', type: 'string' }] },
        { name: 'en', type: 'object', fields: [{ name: 'tipo', type: 'string' }, { name: 'color', type: 'string' }] }
      ]
    },
    { 
      name: 'cuidados', 
      title: 'Cuidados y Mantenimiento', 
      type: 'object', 
      fields: [
        { name: 'es', type: 'text', title: 'Español' }, 
        { name: 'en', type: 'text', title: 'Inglés' }
      ] 
    },

    // --- CAMPOS DE MEDIDAS (Numéricos - No traducibles) ---
    {
      name: 'medidas', title: 'Medidas (cm)', type: 'object',
      fields: [
        { name: 'ancho', type: 'number', title: 'Ancho' },
        { name: 'largo', type: 'number', title: 'Largo' },
        { name: 'alto', type: 'number', title: 'Alto' }
      ]
    },

    // --- CAMPOS ESTÁNDAR ---
    defineField({ name: 'destacado', type: 'boolean', initialValue: false }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'nombre.es' }, validation: (Rule) => Rule.required() }),
    defineField({ name: 'precio', type: 'number', validation: (Rule) => Rule.required().min(0) }),
    defineField({ name: 'imagen', type: 'image', options: { hotspot: true }, validation: (Rule) => Rule.required() }),
    defineField({ name: 'imagenes', type: 'array', of: [{ type: 'image', options: { hotspot: true } }] }),
    defineField({ 
      name: 'estado', type: 'string', 
      options: { list: ['disponible', 'reservado', 'vendido'], layout: 'radio' },
      initialValue: 'disponible' 
    }),
  ],
  // Vista previa que ya tenías
  preview: {
    select: { title: 'nombre.es', estado: 'estado', media: 'imagen' },
    prepare(selection) {
      const { title, estado, media } = selection;
      return { title: title || 'Sin nombre', subtitle: estado, media };
    },
  },
});