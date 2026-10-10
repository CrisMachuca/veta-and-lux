// actions/translateAction.ts
// Botones del Studio para traducir la ficha al inglés con /api/traducir (DeepL si hay clave).
// Escriben en el borrador: hay que revisar y pulsar «Publicar» para que se vea en la web.
import { useState } from 'react'
import { ResetIcon, TranslateIcon } from '@sanity/icons'
import {
  type DocumentActionComponent,
  type DocumentActionDialogProps,
  type DocumentActionProps,
  useDocumentOperation,
} from 'sanity'

// Campos traducibles: ruta del texto en español → ruta del texto en inglés
const CAMPOS = [
  { es: 'nombre.es', en: 'nombre.en', padres: ['nombre'] },
  { es: 'descripcion.es', en: 'descripcion.en', padres: ['descripcion'] },
  { es: 'descripcionLarga.es', en: 'descripcionLarga.en', padres: ['descripcionLarga'] },
  { es: 'materialBase.es', en: 'materialBase.en', padres: ['materialBase'] },
  { es: 'materialPantalla.es.tipo', en: 'materialPantalla.en.tipo', padres: ['materialPantalla', 'materialPantalla.en'] },
  { es: 'materialPantalla.es.color', en: 'materialPantalla.en.color', padres: ['materialPantalla', 'materialPantalla.en'] },
  { es: 'cable.es.tipo', en: 'cable.en.tipo', padres: ['cable', 'cable.en'] },
  { es: 'cable.es.color', en: 'cable.en.color', padres: ['cable', 'cable.en'] },
  { es: 'electrico.interruptor.es', en: 'electrico.interruptor.en', padres: ['electrico', 'electrico.interruptor'] },
  { es: 'cuidados.es', en: 'cuidados.en', padres: ['cuidados'] },
] as const

type Modo = 'vacios' | 'todo'

function leer(doc: Record<string, unknown>, ruta: string): string {
  const valor = ruta.split('.').reduce<unknown>(
    (actual, clave) => (actual && typeof actual === 'object' ? (actual as Record<string, unknown>)[clave] : undefined),
    doc,
  )
  return typeof valor === 'string' ? valor.trim() : ''
}

const MENSAJES_ERROR: Record<string, string> = {
  origen: 'Abre el Studio desde la propia web (vetandlux.com/studio) para poder traducir.',
  limite: 'Demasiadas traducciones seguidas. Espera unos minutos y vuelve a probar.',
  'demasiado-largo': 'Los textos son demasiado largos para traducirlos de una vez.',
  traductor: 'El traductor no responde ahora mismo. Prueba de nuevo en un rato.',
}

function useTraducir(props: DocumentActionProps, modo: Modo) {
  const { patch } = useDocumentOperation(props.id, props.type)
  const [traduciendo, setTraduciendo] = useState(false)
  const [dialogo, setDialogo] = useState<DocumentActionDialogProps | null>(null)

  const doc = (props.draft || props.published) as Record<string, unknown> | null
  const pendientes = doc
    ? CAMPOS.filter((campo) => leer(doc, campo.es) && (modo === 'todo' || !leer(doc, campo.en)))
    : []

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
      const respuesta = await fetch('/api/traducir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ textos: pendientes.map((campo) => leer(doc, campo.es)) }),
      })
      const datos = (await respuesta.json().catch(() => ({}))) as {
        traducciones?: string[]
        motor?: string
        error?: string
      }
      if (!respuesta.ok || !datos.traducciones) {
        throw new Error(MENSAJES_ERROR[datos.error ?? ''] ?? `Error ${respuesta.status}`)
      }

      const valores: Record<string, string> = {}
      const padres = new Set<string>()
      pendientes.forEach((campo, i) => {
        valores[campo.en] = datos.traducciones![i]
        campo.padres.forEach((p) => padres.add(p))
      })
      // Crea los objetos intermedios que falten (primero «cable», luego «cable.en») y después escribe los textos
      const crearPadres = [...padres]
        .sort((a, b) => a.split('.').length - b.split('.').length)
        .map((p) => ({ setIfMissing: { [p]: {} } }))
      patch.execute([...crearPadres, { set: valores }])

      const motor =
        datos.motor === 'deepl'
          ? 'con DeepL'
          : 'con el traductor básico (añade la clave de DeepL para mejor calidad)'
      aviso(
        'Traducción lista',
        `${pendientes.length} ${pendientes.length === 1 ? 'campo traducido' : 'campos traducidos'} ${motor}. ` +
          'Repasa los textos en inglés y pulsa «Publicar» para que se vean en la web.',
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
