import Model, { attr, hasMany } from '@ember-data/model';

export const DECISION_TYPE =
  'http://lblod.data.gift/concept-schemes/71e6455e-1204-46a6-abf4-87319f58eaa5';

export default class ConceptSchemeModel extends Model {
  @attr uri;
  @attr label;

  @hasMany('concept', {
    async: true,
    inverse: 'conceptSchemes',
  })
  concepts;

  @hasMany('concept', {
    async: true,
    inverse: 'topConceptSchemes',
  })
  topConcepts;
}
