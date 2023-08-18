import Model, { hasMany } from '@ember-data/model';

export default class RechtsgrondBeeindigingModel extends Model {
  @hasMany('mandataris', {
    async: true,
    inverse: 'rechtsgrondenBeeindiging',
    polymorphic: true,
    as: 'rechtsgrond-beendiging',
  })
  bekrachtigtOntslagenVan;
}
