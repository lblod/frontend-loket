import Model, { hasMany } from '@ember-data/model';

export default class RechtsgrondAanstellingModel extends Model {
  @hasMany('mandataris', {
    async: true,
    inverse: 'rechtsgrondenAanstelling',
    polymorphic: true,
    as: 'bekrachtigtAanstellingenVan',
  })
  bekrachtigtAanstellingenVan;
}
