import Model, { attr, belongsTo } from '@ember-data/model';

export default class SubsidiemaatregelAanbodModel extends Model {
  @attr('string') naam;

  @belongsTo('concept-scheme') conceptScheme;
}
