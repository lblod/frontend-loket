import Model, { belongsTo } from '@ember-data/model';

export default class LidmaatschapModel extends Model {
  @belongsTo('fractie', { inverse: null }) binnenFractie;

  @belongsTo('mandataris', { inverse: 'heeftLidmaatschap', polymorphic: true })
  lid;

  @belongsTo('tijdsinterval', { inverse: null }) lidGedurende;
}
