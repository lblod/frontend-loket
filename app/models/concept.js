import Model, { attr, hasMany } from '@ember-data/model';

export default class ConceptModel extends Model {
  @attr uri;
  @attr label;

  @hasMany('concept-scheme', {
    async: true,
    inverse: 'concepts',
  })
  conceptSchemes;

  @hasMany('concept-scheme', {
    async: true,
    inverse: 'topConcepts',
  })
  topConceptSchemes;

  @hasMany('concept', { async: true, inverse: null }) broader;
}

export const INVALIDATION_REASON = {
  DUPLICATE:
    'http://data.lblod.info/concepts/InvalidationReason/0f07dbee-277e-4925-9f98-db860c8c4595',
  INVALID:
    'http://data.lblod.info/concepts/InvalidationReason/c959422c-0cac-4fb3-a906-fee80e2a3f4e',
};
