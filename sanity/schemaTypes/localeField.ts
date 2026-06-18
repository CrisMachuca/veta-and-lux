// schemaTypes/localeField.js
 export const localeField = (name: string, title: string, type: string = 'string') => ({
    name,
    title,
    type: 'object',
    fields: [
      {
        name: 'es',
        title: 'Español',
        type: type,
      },
      {
        name: 'en',
        title: 'English',
        type: type,
      },
    ],
  });