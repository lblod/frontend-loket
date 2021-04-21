import Model, { attr, belongsTo } from '@ember-data/model';

export default class SubsidyProceduralStepModel extends Model {
  @attr description;
  @attr('uri-set') type;
  @belongsTo('period-of-time') period;
}
