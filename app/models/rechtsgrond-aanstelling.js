import Model, { hasMany } from '@ember-data/model';

export default class RechtsgrondAanstellingModel extends Model {
  @hasMany('mandataris', {
    inverse: 'rechtsgrondenAanstelling',
    polymorphic: true,
  })
  bekrachtigtAanstellingenVan;
}
