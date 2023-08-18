import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class ConversatieModel extends Model {
  @attr dossiernummer;
  @attr betreft;
  @attr currentTypeCommunicatie;
  @attr reactietermijn;

  @hasMany('bericht', {
    async: true,
    inverse: null,
  })
  berichten;

  @belongsTo('bericht', {
    async: true,
    inverse: null,
  })
  laatsteBericht;
}
