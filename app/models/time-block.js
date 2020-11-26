import Model, {attr, belongsTo} from '@ember-data/model';

export default class TimeBlock extends Model {
  @attr('string') label;
  @attr('date') start;
  @attr('date') end;

  @belongsTo('concept-scheme') conceptScheme;
}
