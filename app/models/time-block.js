import Model, { attr, belongsTo } from '@ember-data/model';

export default class TimeBlock extends Model {
  @attr naam;
  @attr label;
  @attr('date') start;
  @attr('date') end;

  @belongsTo('time-block', {
    async: true,
    inverse: null,
  })
  submissionPeriod;

  @belongsTo('concept-scheme', {
    async: true,
    inverse: null,
  })
  conceptScheme;
}
