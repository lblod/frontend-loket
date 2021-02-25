import Model, { hasMany } from '@ember-data/model';

export default class RechtsgrondBeeindigingModel extends Model {
  @hasMany('mandataris', { inverse: 'rechtsgrondenBeeindiging' }) bekrachtigtOntslagenVan;
}
