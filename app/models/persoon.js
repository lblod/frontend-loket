import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class PersoonModel extends Model {
  @attr achternaam;
  @attr alternatieveNaam;
  @attr gebruikteVoornaam;

  @belongsTo('geboorte', {
    async: true,
    inverse: null,
  })
  geboorte;

  @belongsTo('identificator', {
    async: true,
    inverse: null,
  })
  identificator;

  @belongsTo('geslacht-code', {
    async: true,
    inverse: null,
  })
  geslacht;

  @hasMany('nationality', {
    async: true,
    inverse: null,
  })
  nationalities;

  @hasMany('agent-in-position', {
    async: true,
    inverse: 'isBestuurlijkeAliasVan',
    polymorphic: true,
    as: 'persoon',
  })
  isAangesteldAls;
}
