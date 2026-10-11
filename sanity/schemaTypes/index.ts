import { type SchemaTypeDefinition } from 'sanity';
import { producto } from './producto';
import { articulo } from './articulo';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [producto, articulo],
};