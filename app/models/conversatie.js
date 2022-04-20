import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class ConversatieModel extends Model {
  @attr dossiernummer;
  @attr betreft;
  @attr currentTypeCommunicatie;
  @attr reactietermijn;
  @hasMany('bericht', { inverse: null }) berichten;
  @belongsTo('bericht', { inverse: null }) laatsteBericht;
}
