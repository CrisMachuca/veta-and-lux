// Tipos de los productos tal y como llegan de Sanity (ver sanity/schemaTypes/producto.ts)

export type Traducible<T = string> = { es?: T; en?: T };

export type ImagenSanity = {
  _key?: string;
  // Sin expandir llega { _ref }; con "asset->" llega el documento del asset ({ _id, url })
  asset?: { _ref?: string; _id?: string; url?: string };
};

export type EstadoPieza = "disponible" | "reservado" | "vendido";

export type ProductoSanity = {
  _id: string;
  nombre?: Traducible;
  // Algunas consultas proyectan "slug": slug.current y otras traen el objeto completo
  slug?: string | { current?: string };
  precio?: number;
  descripcion?: Traducible;
  descripcionLarga?: Traducible;
  imagen?: ImagenSanity;
  imagenes?: ImagenSanity[];
  materialBase?: Traducible;
  materialPantalla?: Traducible<{ tipo?: string; color?: string }>;
  cable?: Traducible<{ tipo?: string; color?: string }>;
  medidas?: { ancho?: number; largo?: number; alto?: number };
  cuidados?: Traducible;
  estado?: EstadoPieza;
  tipo?: TipoLampara;
  electrico?: {
    casquillo?: string;
    potenciaMax?: number;
    bombillaIncluida?: boolean;
    longitudCable?: number;
    interruptor?: Traducible;
  };
};

export type TipoLampara = "sobremesa" | "colgante" | "pie" | "aplique" | "otra";

// Valor de un campo traducible en el idioma actual, con el español como respaldo
export function traducir<T>(campo: Traducible<T> | undefined, locale: string): T | undefined {
  return campo?.[locale === "en" ? "en" : "es"] || campo?.es;
}
