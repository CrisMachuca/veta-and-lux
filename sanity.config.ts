'use client'
import {esESLocale} from '@sanity/locale-es-es'
import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {apiVersion, dataset, projectId} from './sanity/env'
import {schema} from './sanity/schemaTypes'
import {structure} from './sanity/structure'
import {RetranslateAction, TranslateAction} from './actions/translateAction'

export default defineConfig({
  basePath: '/studio',
  title: 'Veta & Lux',
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({structure, title: 'Lámparas'}),
    visionTool({defaultApiVersion: apiVersion}),
    // Studio en español
    esESLocale(),
  ],
  document: {
    // «Traducir al inglés» queda la primera del menú ⋯ junto a «Publicar»; «Rehacer traducción», la última
    actions: (prev, context) =>
      context.schemaType === 'producto' || context.schemaType === 'articulo'
        ? [prev[0], TranslateAction, ...prev.slice(1), RetranslateAction]
        : prev,
  },
})
