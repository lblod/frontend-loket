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
}
