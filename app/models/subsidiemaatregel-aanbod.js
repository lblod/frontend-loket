import Model, { attr, belongsTo } from '@ember-data/model';

export default class SubsidiemaatregelAanbodModel extends Model {
  @attr naam;

  @belongsTo('concept-scheme', {
    async: true,
    inverse: null,
  })
  conceptScheme;
}
