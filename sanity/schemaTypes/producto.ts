import { defineField, defineType, type Rule, type ValidationContext } from 'sanity';

// Ficha de lámpara. OJO: no cambiar los «name» de los campos (la web y los datos ya guardados dependen de ellos).
// Los títulos, ayudas, pestañas y avisos sí se pueden cambiar libremente.

const tieneTexto = (valor: unknown) => typeof valor === 'string' && valor.trim() !== '';

// Aviso (no bloquea publicar) cuando hay texto en español y falta el inglés.
// Busca el campo español equivalente cambiando «en» por «es» en la ruta (sirve también para cable.en.tipo).
function avisoIngles(rule: Rule) {
  return rule
    .custom((valor: unknown, contexto: ValidationContext) => {
      const ruta = contexto.path ?? [];
      const i = ruta.lastIndexOf('en');
      if (i === -1) return true;
      const rutaEs = [...ruta.slice(0, i), 'es', ...ruta.slice(i + 1)];
      const es = rutaEs.reduce<unknown>(
        (actual, clave) => (actual && typeof actual === 'object' ? (actual as Record<string, unknown>)[String(clave)] : undefined),
        contexto.document,
      );
      return tieneTexto(es) && !tieneTexto(valor) ? 'Falta el inglés: usa «Traducir al inglés» (menú ⋯ junto a Publicar)' : true;
    })
    .warning();
}

// Campo con versión en español e inglés, una al lado de la otra
function bilingue(
  name: string,
  title: string,
  opciones: {
    tipo?: 'string' | 'text';
    description?: string;
    placeholder?: string;
    filas?: number;
    group?: string | string[];
    validacionEs?: (rule: Rule) => Rule;
    initialValue?: { es: string; en: string };
  } = {},
) {
  const { tipo = 'string', description, placeholder, filas, group, validacionEs, initialValue } = opciones;
  return defineField({
    name,
    title,
    type: 'object',
    description,
    group,
    initialValue,
    options: { columns: 2 },
    fields: [
      { name: 'es', title: 'Español', type: tipo, rows: filas, placeholder, validation: validacionEs },
      { name: 'en', title: 'Inglés', type: tipo, rows: filas, validation: avisoIngles },
    ],
  });
}

// Material de la pantalla y cable: tipo + color en cada idioma
function bilingueTipoColor(name: string, title: string, description: string, ejemplo: { tipo: string; color: string }) {
  const idioma = (nombre: 'es' | 'en', titulo: string) => ({
    name: nombre,
    title: titulo,
    type: 'object',
    fields: [
      { name: 'tipo', title: 'Material', type: 'string', placeholder: nombre === 'es' ? ejemplo.tipo : undefined, validation: nombre === 'en' ? avisoIngles : undefined },
      { name: 'color', title: 'Color', type: 'string', placeholder: nombre === 'es' ? ejemplo.color : undefined, validation: nombre === 'en' ? avisoIngles : undefined },
    ],
  });
  return defineField({
    name,
    title,
    type: 'object',
    description,
    group: 'ficha',
    options: { columns: 2 },
    fields: [idioma('es', 'Español'), idioma('en', 'Inglés')],
  });
}

// Slug limpio para la URL: sin tildes, eñes ni símbolos («Viga de Castaño» → «viga-de-castano»)
const slugLimpio = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

const ETIQUETA_ESTADO: Record<string, string> = {
  disponible: '🟢 Disponible',
  reservado: '🟡 Reservada',
  vendido: '⚫ Vendida',
};

const ETIQUETA_TIPO: Record<string, string> = {
  sobremesa: 'Sobremesa',
  colgante: 'Colgante',
  pie: 'De pie',
  aplique: 'Aplique',
  otra: 'Otra',
};

export const producto = defineType({
  name: 'producto',
  title: 'Lámpara',
  type: 'document',
  groups: [
    { name: 'esencial', title: 'Lo esencial' },
    { name: 'fotos', title: 'Fotos' },
    { name: 'textos', title: 'Textos' },
    { name: 'ficha', title: 'Ficha técnica' },
  ],
  fields: [
    // --- LO ESENCIAL ---
    bilingue('nombre', 'Nombre de la lámpara', {
      group: ['esencial', 'textos'],
      description: 'Corto y con la madera, p. ej. «Olivo Veta». No hace falta poner «lámpara»: la web añade el tipo.',
      placeholder: 'Olivo Veta',
      validacionEs: (rule) => rule.required().error('El nombre en español es obligatorio'),
    }),
    defineField({
      name: 'slug',
      title: 'Dirección web',
      type: 'slug',
      group: 'esencial',
      description: 'Pulsa «Generar» después de escribir el nombre. No la cambies una vez publicada: se rompen los enlaces que ya existan.',
      options: { source: 'nombre.es', slugify: slugLimpio, maxLength: 80 },
      validation: (rule) => rule.required().error('Pulsa «Generar» para crear la dirección web'),
    }),
    defineField({
      name: 'tipo',
      title: 'Tipo de lámpara',
      type: 'string',
      group: ['esencial', 'ficha'],
      description: 'Va en el título de Google y bajo el nombre: «Lámpara de sobremesa de madera de olivo · Olivo Veta».',
      initialValue: 'sobremesa',
      options: {
        list: [
          { title: 'Sobremesa', value: 'sobremesa' },
          { title: 'Colgante', value: 'colgante' },
          { title: 'De pie', value: 'pie' },
          { title: 'Aplique de pared', value: 'aplique' },
          { title: 'Otra', value: 'otra' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      validation: (rule) => rule.required().warning('Elige el tipo: ayuda a que la encuentren en Google'),
    }),
    defineField({
      name: 'madera',
      title: 'Madera',
      type: 'string',
      group: ['esencial', 'ficha'],
      description: 'La madera principal. Va en el título de Google («… de madera de olivo»), que es lo que busca la gente. El detalle (recuperada, centenaria…) va en «Madera / material de la base».',
      options: {
        list: [
          { title: 'Olivo', value: 'olivo' },
          { title: 'Eucalipto', value: 'eucalipto' },
          { title: 'Castaño', value: 'castano' },
          { title: 'Roble', value: 'roble' },
          { title: 'Nogal', value: 'nogal' },
          { title: 'Pino', value: 'pino' },
          { title: 'Almendro', value: 'almendro' },
          { title: 'Otra', value: 'otra' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      validation: (rule) => rule.required().warning('Elige la madera: es lo primero que busca la gente («lámpara de madera de olivo»)'),
    }),
    defineField({
      name: 'precio',
      title: 'Precio (€)',
      type: 'number',
      group: 'esencial',
      description: 'El precio final que paga el cliente, solo el número.',
      validation: (rule) => rule.required().error('Pon el precio').min(0),
    }),
    defineField({
      name: 'estado',
      title: 'Estado',
      type: 'string',
      group: 'esencial',
      description: 'Con pago con tarjeta se marca sola como vendida, y con transferencia como reservada. Cámbialo a mano al confirmar una transferencia o si la vendéis en persona.',
      options: {
        list: [
          { title: 'Disponible', value: 'disponible' },
          { title: 'Reservada', value: 'reservado' },
          { title: 'Vendida', value: 'vendido' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'disponible',
    }),
    // Lo rellena la web al reservar por transferencia. Pasada esta fecha la pieza vuelve a estar disponible.
    // Vacíalo para mantener una reserva manual sin caducidad.
    defineField({
      name: 'reservadoHasta',
      title: 'Reservada hasta',
      type: 'datetime',
      group: 'esencial',
      description: 'Pasada esta fecha la reserva se libera sola. Déjalo vacío para una reserva sin caducidad.',
      hidden: ({ document }) => document?.estado !== 'reservado',
    }),
    defineField({
      name: 'pedidoReserva',
      title: 'Pedido de la reserva',
      type: 'string',
      group: 'esencial',
      readOnly: true,
      hidden: ({ document }) => document?.estado !== 'reservado',
    }),
    defineField({
      name: 'destacado',
      title: 'Destacar en la portada',
      type: 'boolean',
      group: 'esencial',
      initialValue: false,
    }),

    // --- FOTOS ---
    defineField({
      name: 'imagen',
      title: 'Foto principal',
      type: 'image',
      group: ['esencial', 'fotos'],
      description: 'La que se ve en la colección y al compartir. Mejor vertical o cuadrada, con buena luz. Pulsa el lápiz para elegir el punto de interés.',
      options: { hotspot: true },
      validation: (rule) => rule.required().error('Falta la foto principal'),
    }),
    defineField({
      name: 'imagenes',
      title: 'Más fotos',
      type: 'array',
      group: 'fotos',
      description: 'Detalles de la veta, encendida, de lado, en un ambiente… Arrastra para cambiar el orden. Puedes soltar varias a la vez.',
      of: [{ type: 'image', options: { hotspot: true } }],
      options: { layout: 'grid' },
    }),

    // --- TEXTOS ---
    bilingue('descripcion', 'Descripción corta', {
      group: 'textos',
      description: 'Una o dos frases: se ve bajo el nombre y en Google.',
      placeholder: 'Lámpara de sobremesa en olivo centenario con pantalla de lino.',
      validacionEs: (rule) =>
        rule
          .custom((valor: unknown) => {
            if (!tieneTexto(valor)) return 'Escribe una descripción corta';
            return (valor as string).length > 200 ? 'Es un poco larga: mejor menos de 200 caracteres' : true;
          })
          .warning(),
    }),
    bilingue('descripcionLarga', 'Historia de la pieza', {
      tipo: 'text',
      filas: 6,
      group: 'textos',
      description: 'De dónde viene la madera, cómo la habéis trabajado, qué la hace única. Separa los párrafos con una línea en blanco.',
      validacionEs: (rule) =>
        rule.custom((valor: unknown) => (tieneTexto(valor) ? true : 'Cuenta la historia de la pieza: es lo que más vende')).warning(),
    }),
    bilingue('cuidados', 'Cuidados', {
      tipo: 'text',
      filas: 4,
      group: 'textos',
      description: 'Un consejo por línea, empezando con «- ». Viene rellenado con el texto habitual.',
      initialValue: {
        es: '- Usar solo bombillas LED\n- Limpiar con un paño húmedo\n- Aplicar aceite una vez al año',
        en: '- Use LED bulbs only\n- Wipe with a damp cloth\n- Apply oil once a year',
      },
    }),

    // --- FICHA TÉCNICA ---
    defineField({
      name: 'medidas',
      title: 'Medidas (cm)',
      type: 'object',
      group: 'ficha',
      description: 'Con la pantalla puesta. Solo el número.',
      options: { columns: 3 },
      fields: [
        { name: 'ancho', type: 'number', title: 'Ancho' },
        { name: 'largo', type: 'number', title: 'Largo / fondo' },
        { name: 'alto', type: 'number', title: 'Alto' },
      ],
      validation: (rule) =>
        rule
          .custom((valor: { ancho?: number; largo?: number; alto?: number } | undefined) =>
            valor?.alto || valor?.ancho || valor?.largo ? true : 'Pon al menos el alto: es lo primero que mira quien compra',
          )
          .warning(),
    }),
    bilingue('materialBase', 'Madera / material de la base', {
      group: 'ficha',
      placeholder: 'Olivo centenario',
    }),
    bilingueTipoColor('materialPantalla', 'Pantalla', 'Déjalo vacío si la lámpara no lleva pantalla.', { tipo: 'Lino', color: 'Beige' }),
    bilingueTipoColor('cable', 'Cable', 'Material y color del cable.', { tipo: 'Textil trenzado', color: 'Negro' }),
    defineField({
      name: 'electrico',
      title: 'Datos eléctricos',
      type: 'object',
      group: 'ficha',
      fields: [
        defineField({
          name: 'casquillo',
          title: 'Casquillo',
          type: 'string',
          placeholder: 'E27',
          description: 'E27 (rosca grande) o E14 (rosca pequeña).',
          validation: (rule) => rule.required().warning('Indica el casquillo para que sepan qué bombilla comprar'),
        }),
        { name: 'potenciaMax', title: 'Potencia máxima (W)', type: 'number', description: 'La que admite el casquillo, p. ej. 60.' },
        { name: 'bombillaIncluida', title: '¿Incluye bombilla?', type: 'boolean' },
        { name: 'longitudCable', title: 'Largo del cable (m)', type: 'number', description: 'P. ej. 1,8' },
        bilingue('interruptor', 'Interruptor', { placeholder: 'En el cable' }),
      ],
      options: { columns: 2 },
    }),
  ],

  orderings: [
    { title: 'Más recientes', name: 'recientes', by: [{ field: '_createdAt', direction: 'desc' }] },
    { title: 'Nombre', name: 'nombre', by: [{ field: 'nombre.es', direction: 'asc' }] },
    { title: 'Precio, de menor a mayor', name: 'precioAsc', by: [{ field: 'precio', direction: 'asc' }] },
    { title: 'Precio, de mayor a menor', name: 'precioDesc', by: [{ field: 'precio', direction: 'desc' }] },
  ],

  preview: {
    select: { title: 'nombre.es', estado: 'estado', precio: 'precio', tipo: 'tipo', reservadoHasta: 'reservadoHasta', media: 'imagen' },
    prepare({ title, estado, precio, tipo, reservadoHasta, media }) {
      const caducada = estado === 'reservado' && reservadoHasta && new Date(reservadoHasta) < new Date();
      const partes = [
        caducada ? '🟢 Reserva caducada' : ETIQUETA_ESTADO[estado] ?? estado,
        typeof precio === 'number' ? `${precio} €` : 'sin precio',
        tipo ? ETIQUETA_TIPO[tipo] : null,
      ];
      return { title: title || 'Sin nombre', subtitle: partes.filter(Boolean).join(' · '), media };
    },
  },
});
