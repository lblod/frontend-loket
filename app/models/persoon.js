import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class PersoonModel extends Model {

  @attr verifiedMandaten;
  @attr achternaam;
  @attr alternatieveNaam;
  @attr gebruikteVoornaam;

  @belongsTo('geboorte', { inverse: null }) geboorte;
  @belongsTo('identificator', { inverse: null }) identificator;
  @belongsTo('geslacht-code', { inverse: null }) geslacht;
  @hasMany('nationality', { inverse: null }) nationalities;
  @hasMany('mandataris', {
    inverse: 'isBestuurlijkeAliasVan',
    polymorphic: true,
  })
  isAangesteldAls;
  @hasMany('kandidatenlijst', { inverse: 'kandidaten' }) isKandidaatVoor;
}
