import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  achternaam: attr(),
  alternatieveNaam: attr(),
  gebruikteVoornaam: attr(),
  geboorte: belongsTo('geboorte', { inverse: null }),
  identificator: belongsTo('identificator', { inverse: null }),
  geslacht: belongsTo('geslacht-code', { inverse: null }),
  isAangesteldAls: hasMany('mandataris', { inverse: 'isBestuurlijkeAliasVan' }),
  isKandidaatVoor: hasMany('kandidatenlijst', { inverse: 'kandidaten'})
});
