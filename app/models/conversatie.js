import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class ConversatieModel extends Model {
  @attr uri;
  @attr dossiernummer;
  @attr betreft;
  @attr currentTypeCommunicatie;
  @attr reactietermijn;

  @hasMany('bericht', {
    async: false,
    inverse: null,
  })
  berichten;

  @belongsTo('bericht', {
    async: false,
    inverse: null,
  })
  laatsteBericht;
}
