import type {StructureBuilder, StructureResolver} from 'sanity/structure'
import {
  BasketIcon,
  CheckmarkCircleIcon,
  ClockIcon,
  DocumentsIcon,
  StarIcon,
  WarningOutlineIcon,
} from '@sanity/icons'
import {apiVersion} from './env'
import {RESERVA_CADUCADA} from './lib/reservas'

// Menú del Studio: las lámparas agrupadas por estado, más las fichas a las que les falta algo.
// Una reserva caducada cuenta como disponible (igual que en la web).

const sinTexto = (campo: string) => `(!defined(${campo}) || ${campo} == "")`

// Lo que la web necesita para que la ficha esté completa en los dos idiomas
const FICHA_INCOMPLETA = [
  '!defined(tipo)',
  '!defined(madera)',
  '!defined(medidas.alto)',
  '!defined(electrico.casquillo)',
  sinTexto('materialBase.es'),
  sinTexto('descripcion.es'),
  sinTexto('descripcionLarga.es'),
  sinTexto('nombre.en'),
  sinTexto('descripcion.en'),
  sinTexto('descripcionLarga.en'),
].join(' || ')

function lista(
  S: StructureBuilder,
  id: string,
  titulo: string,
  icono: React.ComponentType,
  filtro: string,
) {
  return S.listItem()
    .id(id)
    .title(titulo)
    .icon(icono)
    .child(
      S.documentList()
        .id(id)
        .title(titulo)
        .apiVersion(apiVersion)
        .schemaType('producto')
        .filter(`_type == "producto" && (${filtro})`)
        .defaultOrdering([{field: '_createdAt', direction: 'desc'}])
        .initialValueTemplates([S.initialValueTemplateItem('producto')]),
    )
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Veta & Lux')
    .items([
      lista(S, 'disponibles', 'Disponibles', CheckmarkCircleIcon, `estado == "disponible" || !defined(estado) || (${RESERVA_CADUCADA})`),
      lista(S, 'reservadas', 'Reservadas', ClockIcon, `estado == "reservado" && !(${RESERVA_CADUCADA})`),
      lista(S, 'vendidas', 'Vendidas', BasketIcon, 'estado == "vendido"'),
      S.divider(),
      lista(S, 'por-completar', 'Fichas por completar', WarningOutlineIcon, FICHA_INCOMPLETA),
      lista(S, 'destacadas', 'Destacadas en portada', StarIcon, 'destacado == true'),
      S.divider(),
      S.documentTypeListItem('producto').title('Todas las lámparas').icon(DocumentsIcon),
    ])
