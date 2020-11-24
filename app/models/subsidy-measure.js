import Model, {attr, belongsTo} from '@ember-data/model';

export default class SubsidyMeasureModel extends Model {
  @attr('string') label;

  @belongsTo('concept-scheme') conceptScheme;
}
