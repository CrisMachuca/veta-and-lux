// schemaTypes/localeField.js
export const localeField = (name, title, type = 'string') => ({
    name,
    title,
    type: 'object',
    fields: [
      { name: 'es', title: `${title} (Español)`, type },
      { name: 'en', title: `${title} (Inglés)`, type },
    ],
  });