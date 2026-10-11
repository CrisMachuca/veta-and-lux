// actions/translateAction.ts
// Botones del Studio para traducir al inglés una lámpara o un artículo del Journal con /api/traducir (DeepL si hay clave).
// Escriben en el borrador: hay que revisar y pulsar «Publicar» para que se vea en la web.
import { useState } from 'react'
import { ResetIcon, TranslateIcon } from '@sanity/icons'
import {
  type DocumentActionComponent,
  type DocumentActionDialogProps,
  type DocumentActionProps,
  useDocumentOperation,
} from 'sanity'

// Campos de texto traducibles de cada tipo: ruta del texto en español → ruta del texto en inglés
const CAMPOS_PRODUCTO = [
  { es: 'nombre.es', en: 'nombre.en', padres: ['nombre'] },
  { es: 'descripcion.es', en: 'descripcion.en', padres: ['descripcion'] },
  { es: 'descripcionLarga.es', en: 'descripcionLarga.en', padres: ['descripcionLarga'] },
  { es: 'origenMadera.es', en: 'origenMadera.en', padres: ['origenMadera'] },
  { es: 'proceso.es', en: 'proceso.en', padres: ['proceso'] },
  { es: 'materialBase.es', en: 'materialBase.en', padres: ['materialBase'] },
  { es: 'materialPantalla.es.tipo', en: 'materialPantalla.en.tipo', padres: ['materialPantalla', 'materialPantalla.en'] },
  { es: 'materialPantalla.es.color', en: 'materialPantalla.en.color', padres: ['materialPantalla', 'materialPantalla.en'] },
  { es: 'cable.es.tipo', en: 'cable.en.tipo', padres: ['cable', 'cable.en'] },
  { es: 'cable.es.color', en: 'cable.en.color', padres: ['cable', 'cable.en'] },
  { es: 'electrico.interruptor.es', en: 'electrico.interruptor.en', padres: ['electrico', 'electrico.interruptor'] },
  { es: 'cuidados.es', en: 'cuidados.en', padres: ['cuidados'] },
]

const CAMPOS_ARTICULO = [
  { es: 'titulo.es', en: 'titulo.en', padres: ['titulo'] },
  { es: 'resumen.es', en: 'resumen.en', padres: ['resumen'] },
]

type Modo = 'vacios' | 'todo'

function leer(doc: Record<string, unknown>, ruta: string): string {
  const valor = ruta.split('.').reduce<unknown>(
    (actual, clave) => (actual && typeof actual === 'object' ? (actual as Record<string, unknown>)[clave] : undefined),
    doc,
  )
  return typeof valor === 'string' ? valor.trim() : ''
}

// Algo por traducir: dónde escribir el inglés, qué textos en español traducir, si ya hay inglés,
// qué objetos deben existir antes y cómo montar el valor final a partir de las traducciones
type Campo = { en: string; textosEs: string[]; tieneEn: boolean; padres: string[]; valor: (traducciones: string[]) => unknown }

type Foto = { _key?: string; alt?: { es?: string; en?: string } }
type Bloque = { _type: string; _key?: string; children?: { text?: string }[]; [clave: string]: unknown }

const textoSimple = (doc: Record<string, unknown>, c: { es: string; en: string; padres: string[] }): Campo => ({
  en: c.en,
  textosEs: [leer(doc, c.es)],
  tieneEn: Boolean(leer(doc, c.en)),
  padres: c.padres,
  valor: (t) => t[0],
})

const altDe = (foto: Foto, en: string, padre: string): Campo => ({
  en,
  textosEs: [foto.alt?.es?.trim() ?? ''],
  tieneEn: Boolean(foto.alt?.en?.trim()),
  padres: [padre],
  valor: (t) => t[0],
})

const claveNueva = () => Math.random().toString(36).slice(2, 12)

// Cuerpo del artículo: se traduce cada párrafo, subtítulo o elemento de lista conservando su estilo;
// las fotos se copian. La negrita y los enlaces no se conservan: hay que repasarlos a mano.
function cuerpoDe(doc: Record<string, unknown>): Campo | null {
  const cuerpo = doc.cuerpo as { es?: Bloque[]; en?: Bloque[] } | undefined
  const bloques = cuerpo?.es ?? []
  const texto = (b: Bloque) => (b.children ?? []).map((c) => c.text ?? '').join('').trim()
  const conTexto = bloques.filter((b) => b._type === 'block' && texto(b))
  if (conTexto.length === 0) return null
  return {
    en: 'cuerpo.en',
    textosEs: conTexto.map(texto),
    tieneEn: (cuerpo?.en?.length ?? 0) > 0,
    padres: ['cuerpo'],
    valor: (traducciones) => {
      let i = 0
      return bloques.map((b) => {
        if (b._type === 'block' && texto(b)) {
          return { ...b, _key: claveNueva(), markDefs: [], children: [{ _type: 'span', _key: claveNueva(), text: traducciones[i++], marks: [] }] }
        }
        return { ...b, _key: claveNueva() }
      })
    },
  }
}

// Fotos: la principal y, en las lámparas, cada foto de la galería (localizada por su _key)
function fotosDe(doc: Record<string, unknown>): Campo[] {
  const campos: Campo[] = []
  const principal = doc.imagen as Foto | undefined
  if (principal) campos.push(altDe(principal, 'imagen.alt.en', 'imagen.alt'))
  for (const foto of (doc.imagenes as Foto[] | undefined) ?? []) {
    if (!foto._key) continue
    const ruta = `imagenes[_key=="${foto._key}"].alt`
    campos.push(altDe(foto, `${ruta}.en`, ruta))
  }
  return campos
}

function camposDe(doc: Record<string, unknown>): Campo[] {
  if (doc._type === 'articulo') {
    const cuerpo = cuerpoDe(doc)
    return [...CAMPOS_ARTICULO.map((c) => textoSimple(doc, c)), ...(cuerpo ? [cuerpo] : []), ...fotosDe(doc)]
  }
  return [...CAMPOS_PRODUCTO.map((c) => textoSimple(doc, c)), ...fotosDe(doc)]
}

const MENSAJES_ERROR: Record<string, string> = {
  origen: 'Abre el Studio desde la propia web (vetandlux.com/studio) para poder traducir.',
  limite: 'Demasiadas traducciones seguidas. Espera unos minutos y vuelve a probar.',
  'demasiado-largo': 'Algún párrafo es demasiado largo para traducirlo de una vez. Divídelo en dos.',
  traductor: 'El traductor no responde ahora mismo. Prueba de nuevo en un rato.',
}

// /api/traducir admite hasta 40 textos y 8.000 caracteres por petición: los artículos largos van en tandas
async function traducirTextos(textos: string[]) {
  const tandas: string[][] = [[]]
  let caracteres = 0
  for (const texto of textos) {
    const actual = tandas[tandas.length - 1]
    if (actual.length > 0 && (actual.length >= 40 || caracteres + texto.length > 7000)) {
      tandas.push([])
      caracteres = 0
    }
    tandas[tandas.length - 1].push(texto)
    caracteres += texto.length
  }

  const traducciones: string[] = []
  let motor = 'deepl'
  for (const tanda of tandas) {
    const respuesta = await fetch('/api/traducir', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ textos: tanda }),
    })
    const datos = (await respuesta.json().catch(() => ({}))) as { traducciones?: string[]; motor?: string; error?: string }
    if (!respuesta.ok || !datos.traducciones) {
      throw new Error(MENSAJES_ERROR[datos.error ?? ''] ?? `Error ${respuesta.status}`)
    }
    traducciones.push(...datos.traducciones)
    if (datos.motor !== 'deepl') motor = datos.motor ?? motor
  }
  return { traducciones, motor }
}

function useTraducir(props: DocumentActionProps, modo: Modo) {
  const { patch } = useDocumentOperation(props.id, props.type)
  const [traduciendo, setTraduciendo] = useState(false)
  const [dialogo, setDialogo] = useState<DocumentActionDialogProps | null>(null)

  const doc = (props.draft || props.published) as Record<string, unknown> | null
  const pendientes = doc ? camposDe(doc).filter((campo) => campo.textosEs.some(Boolean) && (modo === 'todo' || !campo.tieneEn)) : []

  const cerrar = () => {
    setDialogo(null)
    props.onComplete()
  }

  const aviso = (titulo: string, texto: string) =>
    setDialogo({ type: 'dialog', header: titulo, content: texto, onClose: cerrar })

  const traducir = async () => {
    if (!doc) return
    if (pendientes.length === 0) {
      aviso(
        'Nada que traducir',
        modo === 'vacios'
          ? 'Todos los campos en inglés ya tienen texto. Si quieres volver a traducirlos, usa «Rehacer traducción al inglés».'
          : 'Rellena primero los textos en español.',
      )
      return
    }

    setTraduciendo(true)
    try {
      const { traducciones, motor } = await traducirTextos(pendientes.flatMap((campo) => campo.textosEs))

      const valores: Record<string, unknown> = {}
      const padres = new Set<string>()
      let inicio = 0
      for (const campo of pendientes) {
        valores[campo.en] = campo.valor(traducciones.slice(inicio, inicio + campo.textosEs.length))
        inicio += campo.textosEs.length
        campo.padres.forEach((p) => padres.add(p))
      }
      // Crea los objetos intermedios que falten (primero «cable», luego «cable.en») y después escribe los textos
      const crearPadres = [...padres]
        .sort((a, b) => a.split('.').length - b.split('.').length)
        .map((p) => ({ setIfMissing: { [p]: {} } }))
      patch.execute([...crearPadres, { set: valores }])

      const textoMotor =
        motor === 'deepl'
          ? 'con DeepL'
          : 'con el traductor básico (añade la clave de DeepL para mejor calidad)'
      const avisoCuerpo = pendientes.some((c) => c.en === 'cuerpo.en') ? ' En el artículo, repasa la negrita y los enlaces.' : ''
      aviso(
        'Traducción lista',
        `${pendientes.length} ${pendientes.length === 1 ? 'campo traducido' : 'campos traducidos'} ${textoMotor}. ` +
          `Repasa los textos en inglés y pulsa «Publicar» para que se vean en la web.${avisoCuerpo}`,
      )
    } catch (error) {
      aviso('No se ha podido traducir', error instanceof Error ? error.message : String(error))
    } finally {
      setTraduciendo(false)
    }
  }

  return { doc, pendientes, traduciendo, dialogo, setDialogo, traducir, cerrar, bloqueado: Boolean(patch.disabled) }
}

// Rellena solo los campos en inglés que están vacíos: nunca pisa lo que ya se haya corregido a mano
export const TranslateAction: DocumentActionComponent = (props) => {
  const { doc, pendientes, traduciendo, dialogo, traducir, bloqueado } = useTraducir(props, 'vacios')

  return {
    label: traduciendo ? 'Traduciendo…' : 'Traducir al inglés',
    title:
      pendientes.length > 0
        ? `Traduce los ${pendientes.length} campos en inglés que están vacíos`
        : 'Todos los campos en inglés tienen texto',
    icon: TranslateIcon,
    disabled: !doc || traduciendo || bloqueado,
    onHandle: traducir,
    dialog: dialogo,
  }
}

// Vuelve a traducir todos los campos, sobrescribiendo el inglés (pide confirmación)
export const RetranslateAction: DocumentActionComponent = (props) => {
  const { doc, pendientes, traduciendo, dialogo, setDialogo, traducir, cerrar, bloqueado } = useTraducir(props, 'todo')

  return {
    label: traduciendo ? 'Traduciendo…' : 'Rehacer traducción al inglés',
    title: 'Vuelve a traducir todos los campos y sustituye el inglés actual',
    icon: ResetIcon,
    tone: 'caution',
    disabled: !doc || traduciendo || bloqueado || pendientes.length === 0,
    onHandle: () =>
      setDialogo({
        type: 'confirm',
        tone: 'caution',
        message: `Se sustituirá el texto en inglés de ${pendientes.length} campos, incluidas las correcciones hechas a mano. ¿Continuar?`,
        confirmButtonText: 'Sí, rehacer',
        cancelButtonText: 'Cancelar',
        onCancel: cerrar,
        onConfirm: () => {
          setDialogo(null)
          traducir()
        },
      }),
    dialog: dialogo,
  }
}
