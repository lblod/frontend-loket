import Model, { belongsTo } from '@ember-data/model';

export default class LidmaatschapModel extends Model {
  @belongsTo('fractie', {
    async: true,
    inverse: null,
  })
  binnenFractie;

  @belongsTo('mandataris', {
    async: true,
    inverse: 'heeftLidmaatschap',
    polymorphic: true,
    as: 'lidmaatschap',
  })
  lid;

  @belongsTo('tijdsinterval', { async: true, inverse: null }) lidGedurende;
}
