'use client'

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

import {apiVersion, dataset, projectId} from './sanity/env'
import {schema} from './sanity/schemaTypes'
import {structure} from './sanity/structure'

// IMPORTAMOS LA ACCIÓN QUE CREAMOS
import { TranslateAction } from './actions/translateAction'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({structure}),
    visionTool({defaultApiVersion: apiVersion}),
  ],
  // AÑADIMOS ESTO PARA EL BOTÓN
  document: {
    actions: (prev, context) => {
      // Solo añadimos el botón si el documento es de tipo 'producto'
      if (context.schemaType === 'producto') {
        return [...prev, TranslateAction]
      }
      return prev
    },
  },
})