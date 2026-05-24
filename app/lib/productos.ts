export type Producto = {
  id: number;
  slug: string;
  nombre: string;
  precio: string;
  descripcion: string;
  descripcionLarga: string;
  medidas: string[];
  cuidados: string[];
  imagen: string;
  imagenes: string[];
  materialBase: string;
  materialPantalla?: {
    tipo: string;
    color: string;
  };
  cable?: {
    tipo: string;
    color: string;
  };
};

export const productos: Producto[] = [
  {
    id: 1,
    slug: "sobremesa-olivo",
    nombre: "Sobremesa Olivo",
    precio: "230€",
    descripcion: "Con pantalla cilíndrica de lino",
    imagen: "/tronco1.jpeg",
    descripcionLarga: "Sobremesa artesanal en madera de olivo recuperada, equilibrada con pantalla de lino para una luz cálida y envolvente.",
    medidas: ["Base: 20x20 cm", "Altura: 45 cm"],
    materialBase: "Madera de Olivo recuperada",
    materialPantalla: { tipo: "Lino natural", color: "Beige" },
    cable: { tipo: "Textil trenzado", color: "Marrón Yute" },
    cuidados: ["Limpieza con paño seco.", "Aceite de mantenimiento cada 6 meses.", "Evitar sol directo."],
    imagenes: ["/tronco1.jpeg", "/detalle.png", "/taller.png"],
  },
  {
    id: 2,
    slug: "viga-castano",
    nombre: "Viga Castaño",
    precio: "485€",
    descripcion: "Viga de madera recuperada suspendida",
    imagen: "/viga1.png",
    descripcionLarga: "Lámpara lineal suspendida sobre viga de castaño recuperada. Una pieza protagonista para comedores y espacios abiertos.",
    medidas: ["Largo: 130 cm", "Ancho: 15 cm"],
    materialBase: "Castaño macizo recuperado",
    cable: { tipo: "Acero y Textil", color: "Negro Mate" },
    cuidados: ["Plumero suave.", "Revisar anclajes anualmente.", "No usar alcohol."],
    imagenes: ["/viga1.png", "/viga2.png", "/detalle.png"],
  },
  {
    id: 3,
    slug: "sobremesa-tronco-natural",
    nombre: "Sobremesa tronco natural",
    precio: "155€",
    descripcion: "Tronco pulido con bombilla de filamento vista",
    imagen: "/bombilla1.jpeg",
    descripcionLarga: "Base de tronco natural pulido que conserva sus vetas originales, combinada con bombilla de filamento para un ambiente íntimo.",
    medidas: ["Diámetro aprox: 15 cm", "Altura: 20 cm"],
    materialBase: "Madera de pino silvestre pulida",
    cable: { tipo: "Cáñamo rústico", color: "Natural" },
    cuidados: ["Evitar humedad.", "Limpiar con brocha suave.", "Usar bombillas LED."],
    imagenes: ["/bombilla1.jpeg", "/troncobombilla_white.png", "/troncobombilla_fondo.png"],
  },
  {
    id: 4,
    slug: "lampara-madera-olivo",
    nombre: "Lampara madera olivo",
    precio: "210€",
    descripcion: "Cada pieza es única.",
    imagen: "/bombilla2.jpeg",
    descripcionLarga: "Pieza única en olivo con geometría orgánica y luz puntual. Ideal para dar carácter a mesas auxiliares.",
    medidas: ["15x12x25 cm"],
    materialBase: "Olivo de poda controlada",
    cable: { tipo: "Textil premium", color: "Oro viejo" },
    cuidados: ["Cera natural una vez al año.", "Paño seco.", "Luz interior."],
    imagenes: ["/bombilla2.jpeg", "/tronco1.jpeg", "/acabado.png"],
  },
  {
    id: 5,
    slug: "sobremesa-pantalla-lino",
    nombre: "Sobremesa con pantalla de lino",
    precio: "220€",
    descripcion: "Base de madera natural con nudos y vetas",
    imagen: "/troncobase_fondo.png",
    descripcionLarga: "Base maciza con nudos visibles y pantalla de lino natural. Diseñada para aportar calidez suave.",
    medidas: ["Altura: 50 cm", "Pantalla: 30 cm Ø"],
    materialBase: "Madera de Roble europeo",
    materialPantalla: { tipo: "Lino artesano", color: "Blanco roto" },
    cable: { tipo: "Textil liso", color: "Gris piedra" },
    cuidados: ["Aspirar pantalla suavemente.", "No mojar la madera.", "Bombilla cálida."],
    imagenes: ["/troncobase_fondo.png", "/troncobase_white.png", "/taller.png"],
  },
  {
    id: 6,
    slug: "eucalipto-caoba",
    nombre: "Eucalipto caoba",
    precio: "320€",
    descripcion: "Ideal como luz de cabecera.",
    imagen: "/tronco2.jpeg",
    descripcionLarga: "Sobremesa de eucalipto con tono caoba y textura viva. Proyecta una iluminación equilibrada.",
    medidas: ["18x18x35 cm"],
    materialBase: "Eucalipto tratado con pigmentos naturales",
    materialPantalla: { tipo: "Algodón orgánico", color: "Tostado" },
    cable: { tipo: "Seda trenzada", color: "Burdeos" },
    cuidados: ["Limpiar en sentido de la veta.", "Evitar radiadores.", "Paño de algodón."],
    imagenes: ["/tronco2.jpeg", "/tronco3.jpeg", "/acabado.png"],
  },
  {
    id: 7,
    slug: "tronco-rustico-ambar",
    nombre: "Tronco Rústico Ámbar",
    precio: "275€",
    descripcion: "Pieza de acento con veta marcada y luz cálida.",
    imagen: "/tronco3.jpeg",
    descripcionLarga: "Tronco recuperado con veta profunda y acabado ámbar. Una pieza escultórica que aporta textura.",
    medidas: ["25x20x40 cm"],
    materialBase: "Madera de Pino centenario",
    cable: { tipo: "Textil grueso", color: "Ámbar" },
    cuidados: ["Aceite de linaza anual.", "No usar químicos.", "Revisar cableado."],
    imagenes: ["/tronco3.jpeg", "/tronco4.jpeg", "/busqueda.png"],
  },
  {
    id: 8,
    slug: "lampara-viga-natural",
    nombre: "Lámpara Viga Natural",
    precio: "340€",
    descripcion: "Diseño lineal en madera maciza.",
    imagen: "/tronco4.jpeg",
    descripcionLarga: "Diseño lineal en madera maciza pensado para mesas largas y estancias amplias.",
    medidas: ["Largo: 100 cm", "Alto: 12 cm"],
    materialBase: "Madera de Fresno natural",
    cable: { tipo: "Acero engomado", color: "Transparente" },
    cuidados: ["Limpieza superior mensual.", "Verificar anclajes.", "Paño seco."],
    imagenes: ["/tronco4.jpeg", "/viga1.png", "/viga2.png"],
  },
  {
    id: 9,
    slug: "palo-artesanal-roble",
    nombre: "Palo Artesanal Roble",
    precio: "260€",
    descripcion: "Estilo orgánico con acabado mate.",
    imagen: "/palo1.jpeg",
    descripcionLarga: "Pieza vertical en roble recuperado con líneas limpias y acabado mate. Perfecta para rincones de lectura.",
    medidas: ["Base: 15 cm Ø", "Altura: 60 cm"],
    materialBase: "Roble recuperado",
    materialPantalla: { tipo: "Cáñamo", color: "Crudo" },
    cable: { tipo: "Textil", color: "Negro" },
    cuidados: ["Evitar objetos húmedos.", "Paño sin silicona.", "Interior seco."],
    imagenes: ["/palo1.jpeg", "/detalle.png", "/acabado.png"],
  },
  {
    id: 10,
    slug: "tronco-vertical-nordico",
    nombre: "Tronco Vertical Nórdico",
    precio: "295€",
    descripcion: "Perfil limpio para ambientes minimalistas.",
    imagen: "/tronco5.png",
    descripcionLarga: "Tronco vertical con perfil nórdico y proporciones contenidas. Integra luz ambiental serena.",
    medidas: ["Altura: 55 cm", "Base: 12 cm"],
    materialBase: "Abedul de crecimiento lento",
    materialPantalla: { tipo: "Lino fino", color: "Gris perla" },
    cable: { tipo: "Textil", color: "Blanco nieve" },
    cuidados: ["Paño antiestático.", "Evitar corrientes húmedas.", "Bombilla LED fría."],
    imagenes: ["/tronco5.png", "/tronco7.png", "/taller.png"],
  },
  {
    id: 11,
    slug: "luz-colgante-nogal",
    nombre: "Luz Colgante Nogal",
    precio: "360€",
    descripcion: "Suspensión cálida con veta oscura.",
    imagen: "/viga2.png",
    descripcionLarga: "Colgante en nogal con veta oscura y presencia elegante. Diseñado para crear focos cálidos.",
    medidas: ["Diámetro: 20 cm", "Altura madera: 30 cm"],
    materialBase: "Nogal Español",
    cable: { tipo: "Textil reforzado", color: "Negro" },
    cuidados: ["Limpiar cuerpo con paño suave.", "Evitar vapores de cocina.", "Instalación por profesional."],
    imagenes: ["/viga2.png", "/viga1.png", "/detalle.png"],
  },
  {
    id: 12,
    slug: "sobremesa-raiz-serena",
    nombre: "Sobremesa Raíz Serena",
    precio: "245€",
    descripcion: "Base orgánica en madera recuperada.",
    imagen: "/troncolujo_fondo.png",
    descripcionLarga: "Sobremesa de base orgánica con inspiración en raíces naturales. Su forma suave invita al descanso.",
    medidas: ["30x25x45 cm"],
    materialBase: "Raíz de Olmo recuperada",
    materialPantalla: { tipo: "Lino rústico", color: "Arena" },
    cable: { tipo: "Textil", color: "Tostado" },
    cuidados: ["Paño de algodón.", "Protección térmica.", "No usar líquidos."],
    imagenes: ["/troncolujo_fondo.png", "/troncolujo_white.png", "/busqueda.png"],
  },
];

export function getProductoBySlug(slug: string) {
  return productos.find((p) => p.slug === slug);
}