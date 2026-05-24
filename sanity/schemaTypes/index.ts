import { type SchemaTypeDefinition } from 'sanity';
import { producto } from './producto';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [producto],
};