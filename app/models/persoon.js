import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class PersoonModel extends Model {
  @attr() achternaam;
  @attr() alternatieveNaam;
  @attr() gebruikteVoornaam;
  @attr() verifiedMandaten;
  @belongsTo('geboorte', { inverse: null }) geboorte;
  @belongsTo('identificator', { inverse: null }) identificator;
  @belongsTo('geslacht-code', { inverse: null }) geslacht;
  @hasMany('mandataris', { inverse: 'isBestuurlijkeAliasVan' }) isAangesteldAls;
  @hasMany('kandidatenlijst', { inverse: 'kandidaten'}) isKandidaatVoor;
}
>>>>>>> master
