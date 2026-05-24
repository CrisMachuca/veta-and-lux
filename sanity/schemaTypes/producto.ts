import { defineField, defineType } from 'sanity';

export const producto = defineType({
  name: 'producto',
  title: 'Productos (Lámparas)',
  type: 'document',
  fields: [
    defineField({
      name: 'nombre',
      title: 'Nombre de la Lámpara',
      type: 'string',
      validation: (Rule) => Rule.required().error('El nombre es obligatorio'),
    }),
    defineField({
      name: 'destacado',
      title: 'Producto Destacado',
      type: 'boolean',
      description: 'Activa esta opción para que el producto aparezca en la sección principal de la web',
      initialValue: false,
    }),
    
    defineField({
      name: 'slug',
      title: 'Enlace Amigable (Slug)',
      type: 'slug',
      description: 'Haz clic en "Generate" después de poner el nombre.',
      options: { source: 'nombre', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'precio',
      title: 'Precio (€)',
      type: 'number',
      description: 'Pon solo el número (ej: 230). La web le añadirá el símbolo € automáticamente.',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'descripcion',
      title: 'Descripción Corta',
      type: 'string',
      description: 'Frase breve para el catálogo (ej: Con pantalla cilíndrica de lino)',
    }),
    defineField({
      name: 'descripcionLarga',
      title: 'Descripción Larga / Historia',
      type: 'text',
      description: 'Cuenta la historia detallada de la madera y el proceso.',
    }),
    defineField({
      name: 'imagen',
      title: 'Foto Principal',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required().error('La foto principal es obligatoria'),
    }),
    defineField({
      name: 'imagenes',
      title: 'Galería de Fotos Secundarias',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Sube el resto de fotos de detalle del producto.',
    }),
    defineField({
      name: 'materialBase',
      title: 'Material de la Base',
      type: 'string',
      description: 'Ej: Madera de Olivo recuperada',
    }),
    // Grupo de Pantalla
    defineField({
      name: 'materialPantalla',
      title: 'Material de la Pantalla (Opcional)',
      type: 'object',
      fields: [
        { name: 'tipo', title: 'Tipo de material', type: 'string', description: 'Ej: Lino natural' },
        { name: 'color', title: 'Color', type: 'string', description: 'Ej: Beige' }
      ]
    }),
    // Grupo de Cable
    defineField({
      name: 'cable',
      title: 'Detalles del Cable (Opcional)',
      type: 'object',
      fields: [
        { name: 'tipo', title: 'Tipo de cable', type: 'string', description: 'Ej: Textil trenzado' },
        { name: 'color', title: 'Color', type: 'string', description: 'Ej: Marrón Yute' }
      ]
    }),
    defineField({
      name: 'medidas',
      title: 'Medidas',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Añade las líneas que quieras (ej: "Base: 20x20 cm", "Altura: 45 cm")',
    }),
    defineField({
      name: 'cuidados',
      title: 'Cuidados y Mantenimiento',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Consejos (ej: "Limpieza con paño seco.", "Evitar sol directo.")',
    }),
    defineField({
      name: 'estado',
      title: 'Estado del Stock',
      type: 'string',
      options: {
        list: [
          { title: '🟢 Disponible', value: 'disponible' },
          { title: '🟡 Reservado (Transferencia pendiente)', value: 'reservado' },
          { title: '🔴 Vendido / Agotado', value: 'vendido' },
        ],
        layout: 'radio',
      },
      initialValue: 'disponible',
    }),
  ],
});