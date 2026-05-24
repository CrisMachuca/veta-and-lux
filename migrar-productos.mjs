import { createClient } from '@sanity/client';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

if (!process.env.SANITY_WRITE_TOKEN) {
  console.error('❌ Error: No se encuentra el SANITY_WRITE_TOKEN en .env.local');
  process.exit(1);
}

const clienteEscritura = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-03-24',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

// 1. ARRAY COMPLETO ORIGINAL CON TODAS LAS IMÁGENES SECUNDARIAS INCLUIDAS
const productosAntiguos = [
  {
    slug: "sobremesa-olivo",
    nombre: "Sobremesa Olivo",
    precio: 230,
    descripcion: "Con pantalla cilíndrica de lino",
    imagenLocal: "tronco1.jpeg",
    descripcionLarga: "Sobremesa artesanal en madera de olivo recuperada, equilibrada con pantalla de lino para una luz cálida y envolvente.",
    medidas: ["Base: 20x20 cm", "Altura: 45 cm"],
    materialBase: "Madera de Olivo recuperada",
    materialPantalla: { tipo: "Lino natural", color: "Beige" },
    cable: { tipo: "Textil trenzado", color: "Marrón Yute" },
    cuidados: ["Limpieza con paño seco.", "Aceite de mantenimiento cada 6 meses.", "Evitar sol directo."],
    imagenesLocales: ["tronco1.jpeg", "detalle.png", "taller.png"] // Corregido: Array de fotos reales
  },
  {
    slug: "viga-castano",
    nombre: "Viga Castaño",
    precio: 485,
    descripcion: "Viga de madera recuperada suspendida",
    imagenLocal: "viga1.png",
    descripcionLarga: "Lámpara lineal suspendida sobre viga de castaño recuperada. Una pieza protagonista para comedores y espacios abiertos.",
    medidas: ["Largo: 130 cm", "Ancho: 15 cm"],
    materialBase: "Castaño macizo recuperado",
    cable: { tipo: "Acero y Textil", color: "Negro Mate" },
    cuidados: ["Plumero suave.", "Revisar anclajes anualmente.", "No usar alcohol."],
    imagenesLocales: ["viga1.png", "viga2.png", "detalle.png"]
  },
  {
    slug: "sobremesa-tronco-natural",
    nombre: "Sobremesa tronco natural",
    precio: 155,
    descripcion: "Tronco pulido con bombilla de filamento vista",
    imagenLocal: "bombilla1.jpeg",
    descripcionLarga: "Base de tronco natural pulido que conserva sus vetas originales, combinada con bombilla de filamento para un ambiente íntimo.",
    medidas: ["Diámetro aprox: 15 cm", "Altura: 20 cm"],
    materialBase: "Madera de pino silvestre pulida",
    cable: { tipo: "Cáñamo rústico", color: "Natural" },
    cuidados: ["Evitar humedad.", "Limpiar con brocha suave.", "Usar bombillas LED."],
    imagenesLocales: ["bombilla1.jpeg", "troncobombilla_white.png", "troncobombilla_fondo.png"]
  },
  {
    slug: "lampara-madera-olivo",
    nombre: "Lampara madera olivo",
    precio: 210,
    descripcion: "Cada pieza es única.",
    imagenLocal: "bombilla2.jpeg",
    descripcionLarga: "Pieza única en olivo con geometría orgánica y luz puntual. Ideal para dar carácter a mesas auxiliares.",
    medidas: ["15x12x25 cm"],
    materialBase: "Olivo de poda controlada",
    cable: { tipo: "Textil premium", color: "Oro viejo" },
    cuidados: ["Cera natural una vez al año.", "Paño seco.", "Luz interior."],
    imagenesLocales: ["bombilla2.jpeg", "tronco1.jpeg", "acabado.png"]
  },
  {
    slug: "sobremesa-pantalla-lino",
    nombre: "Sobremesa con pantalla de lino",
    precio: 220,
    descripcion: "Base de madera natural con nudos y vetas",
    imagenLocal: "troncobase_fondo.png",
    descripcionLarga: "Base maciza con nudos visibles y pantalla de lino natural. Diseñada para aportar calidez suave.",
    medidas: ["Altura: 50 cm", "Pantalla: 30 cm Ø"],
    materialBase: "Madera de Roble europeo",
    materialPantalla: { tipo: "Lino artesano", color: "Blanco roto" },
    cable: { tipo: "Textil liso", color: "Gris piedra" },
    cuidados: ["Aspirar pantalla suavemente.", "No mojar la madera.", "Bombilla cálida."],
    imagenesLocales: ["troncobase_fondo.png", "troncobase_white.png", "taller.png"]
  },
  {
    slug: "eucalipto-caoba",
    nombre: "Eucalipto caoba",
    precio: 320,
    descripcion: "Ideal como luz de cabecera.",
    imagenLocal: "tronco2.jpeg",
    descripcionLarga: "Sobremesa de eucalipto con tono caoba y textura viva. Proyecta una iluminación equilibrada.",
    medidas: ["18x18x35 cm"],
    materialBase: "Eucalipto tratado con pigmentos naturales",
    materialPantalla: { tipo: "Algodón orgánico", color: "Tostado" },
    cable: { tipo: "Seda trenzada", color: "Burdeos" },
    cuidados: ["Limpiar en sentido de la veta.", "Evitar radiadores.", "Paño de algodón."],
    imagenesLocales: ["tronco2.jpeg", "tronco3.jpeg", "acabado.png"]
  },
  {
    slug: "tronco-rustico-ambar",
    nombre: "Tronco Rústico Ámbar",
    precio: 275,
    descripcion: "Pieza de acento con veta marcada y luz cálida.",
    imagenLocal: "tronco3.jpeg",
    descripcionLarga: "Tronco recuperado con veta profunda y acabado ámbar. Una pieza escultórica que aporta textura.",
    medidas: ["25x20x40 cm"],
    materialBase: "Madera de Pino centenario",
    cable: { tipo: "Textil grueso", color: "Ámbar" },
    cuidados: ["Aceite de linaza anual.", "No usar químicos.", "Revisar cableado."],
    imagenesLocales: ["tronco3.jpeg", "tronco4.jpeg", "busqueda.png"]
  },
  {
    slug: "lampara-viga-natural",
    nombre: "Lámpara Viga Natural",
    precio: 340,
    descripcion: "Diseño lineal en madera maciza.",
    imagenLocal: "tronco4.jpeg",
    descripcionLarga: "Diseño lineal en madera maciza pensado para mesas largas y estancias amplias.",
    medidas: ["Largo: 100 cm", "Alto: 12 cm"],
    materialBase: "Madera de Fresno natural",
    cable: { tipo: "Acero engomado", color: "Transparente" },
    cuidados: ["Limpieza superior mensual.", "Verificar anclajes.", "Paño seco."],
    imagenesLocales: ["tronco4.jpeg", "viga1.png", "viga2.png"]
  },
  {
    slug: "palo-artesanal-roble",
    nombre: "Palo Artesanal Roble",
    precio: 260,
    descripcion: "Estilo orgánico con acabado mate.",
    imagenLocal: "palo1.jpeg",
    descripcionLarga: "Pieza vertical en roble recuperado con líneas limpias y acabado mate. Perfecta para rincones de lectura.",
    medidas: ["Base: 15 cm Ø", "Altura: 60 cm"],
    materialBase: "Roble recuperado",
    materialPantalla: { tipo: "Cáñamo", color: "Crudo" },
    cable: { tipo: "Textil", color: "Negro" },
    cuidados: ["Evitar objetos húmedos.", "Paño sin silicona.", "Interior seco."],
    imagenesLocales: ["palo1.jpeg", "detalle.png", "acabado.png"]
  },
  {
    slug: "tronco-vertical-nordico",
    nombre: "Tronco Vertical Nórdico",
    precio: 295,
    descripcion: "Perfil limpio para ambientes minimalistas.",
    imagenLocal: "tronco5.png",
    descripcionLarga: "Tronco vertical con perfil nórdico y proporciones contenidas. Integra luz ambiental serena.",
    medidas: ["Altura: 55 cm", "Base: 12 cm"],
    materialBase: "Abedul de crecimiento lento",
    materialPantalla: { tipo: "Lino fino", color: "Gris perla" },
    cable: { tipo: "Textil", color: "Blanco nieve" },
    cuidados: ["Paño antiestático.", "Evitar corrientes húmedas.", "Bombilla LED fría."],
    imagenesLocales: ["tronco5.png", "tronco7.png", "taller.png"]
  },
  {
    slug: "luz-colgante-nogal",
    nombre: "Luz Colgante Nogal",
    precio: 360,
    descripcion: "Suspensión cálida con veta oscura.",
    imagenLocal: "viga2.png",
    descripcionLarga: "Colgante en nogal con veta oscura y presencia elegante. Diseñado para crear focos cálidos.",
    medidas: ["Diámetro: 20 cm", "Altura madera: 30 cm"],
    materialBase: "Nogal Español",
    cable: { tipo: "Textil reforzado", color: "Negro" },
    cuidados: ["Limpiar cuerpo con paño suave.", "Evitar vapores de cocina.", "Instalación por profesional."],
    imagenesLocales: ["viga2.png", "viga1.png", "detalle.png"]
  },
  {
    slug: "sobremesa-raiz-serena",
    nombre: "Sobremesa Raíz Serena",
    precio: 245,
    descripcion: "Base orgánica en madera recuperada.",
    imagenLocal: "troncolujo_fondo.png",
    descripcionLarga: "Sobremesa de base orgánica con inspiración en raíces naturales. Su forma suave invita al descanso.",
    medidas: ["30x25x45 cm"],
    materialBase: "Raíz de Olmo recuperada",
    materialPantalla: { tipo: "Lino rústico", color: "Arena" },
    cable: { tipo: "Textil", color: "Tostado" },
    cuidados: ["Paño de algodón.", "Protección térmica.", "No usar líquidos."],
    imagenesLocales: ["troncolujo_fondo.png", "troncolujo_white.png", "busqueda.png"]
  }
];

// Función auxiliar para subir un archivo local y devolver la referencia de Sanity
async function subirImagenASanity(nombreArchivo) {
  // Limpiamos barras iniciales por si acaso
  const nombreLimpio = nombreArchivo.replace(/^\//, '');
  const ruta = join(process.cwd(), 'public', nombreLimpio);
  
  if (!existsSync(ruta)) {
    console.warn(`   ⚠️ Archivo no encontrado: ${ruta}`);
    return null;
  }

  const archivoBuffer = readFileSync(ruta);
  const asset = await clienteEscritura.assets.upload('image', archivoBuffer, {
    filename: nombreLimpio,
  });
  return asset._id;
}

async function migrar() {
  console.log('🚀 Iniciando migración de productos con soporte de galería secundaria...');

  for (const prod of productosAntiguos) {
    try {
      console.log(`\n📦 Procesando: ${prod.nombre}...`);

      // 1. Subir la imagen de portada principal
      const assetPrincipalId = await subirImagenASanity(prod.imagenLocal);

      // 2. Subir el array de imágenes secundarias de forma secuencial
      const referenciasImagenesSecundarias = [];
      if (prod.imagenesLocales && prod.imagenesLocales.length > 0) {
        console.log(`   Subiendo ${prod.imagenesLocales.length} imágenes para la galería...`);
        for (const imgSecundaria of prod.imagenesLocales) {
          const assetSecundarioId = await subirImagenASanity(imgSecundaria);
          if (assetSecundarioId) {
            referenciasImagenesSecundarias.push({
              _key: Math.random().toString(36).substring(2, 11), // Clave única obligatoria en arrays de Sanity
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: assetSecundarioId,
              },
            });
          }
        }
      }

      // 3. Montar el documento final para la base de datos
      const documentoProducto = {
        _type: 'producto',
        nombre: prod.nombre,
        slug: {
          _type: 'slug',
          current: prod.slug,
        },
        precio: prod.precio,
        descripcion: prod.descripcion,
        descripcionLarga: prod.descripcionLarga,
        materialBase: prod.materialBase,
        medidas: prod.medidas,
        cuidados: prod.cuidados,
        estado: 'disponible',
        ...(assetPrincipalId && {
          imagen: {
            _type: 'image',
            asset: { _type: 'reference', _ref: assetPrincipalId },
          },
        }),
        // Sincronización del array de galería
        imagenes: referenciasImagenesSecundarias,
        ...(prod.materialPantalla && { materialPantalla: prod.materialPantalla }),
        ...(prod.cable && { cable: prod.cable }),
      };

      // 4. Subir a Sanity
      const resultado = await clienteEscritura.create(documentoProducto);
      console.log(`   🎉 Creado con éxito. ID: ${resultado._id}`);

    } catch (error) {
      console.error(`   ❌ Error en ${prod.nombre}:`, error.message);
    }
  }

  console.log('\n🏁 ¡Migración masiva terminada con galerías completas!');
}

migrar();