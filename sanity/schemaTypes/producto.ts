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

    // --- TIPO Y DATOS ELÉCTRICOS (se muestran en la ficha y se usan en el título para buscadores) ---
    defineField({
      name: 'tipo', title: 'Tipo de lámpara', type: 'string',
      description: 'Se añade al título de la ficha en Google: «Nombre · Lámpara de sobremesa».',
      options: {
        list: [
          { title: 'Sobremesa', value: 'sobremesa' },
          { title: 'Colgante', value: 'colgante' },
          { title: 'De pie', value: 'pie' },
          { title: 'Aplique de pared', value: 'aplique' },
          { title: 'Otra', value: 'otra' },
        ],
        layout: 'radio',
      },
    }),
    {
      name: 'electrico', title: 'Datos eléctricos', type: 'object',
      fields: [
        { name: 'casquillo', title: 'Casquillo', type: 'string', description: 'Ej.: E27, E14' },
        { name: 'potenciaMax', title: 'Potencia máxima recomendada (W)', type: 'number' },
        { name: 'bombillaIncluida', title: '¿Incluye bombilla?', type: 'boolean' },
        { name: 'longitudCable', title: 'Longitud del cable (m)', type: 'number' },
        {
          name: 'interruptor', title: 'Interruptor', type: 'object',
          description: 'Ej.: «En el cable», «Regulador de intensidad»',
          fields: [{ name: 'es', type: 'string', title: 'Español' }, { name: 'en', type: 'string', title: 'Inglés' }],
        },
      ],
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
    // Lo rellena la web al reservar por transferencia. Pasada esta fecha la pieza vuelve a estar disponible.
    // Vacíalo para mantener una reserva manual sin caducidad.
    defineField({
      name: 'reservadoHasta',
      title: 'Reservado hasta',
      type: 'datetime',
      description: 'Pasada esta fecha la reserva se libera sola. Déjalo vacío para una reserva sin caducidad.',
      hidden: ({ document }) => document?.estado !== 'reservado',
    }),
    defineField({
      name: 'pedidoReserva',
      title: 'Pedido de la reserva',
      type: 'string',
      readOnly: true,
      hidden: ({ document }) => document?.estado !== 'reservado',
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