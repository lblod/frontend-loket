import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class ConversatieModel extends Model {
  @attr('string') dossiernummer;
  @attr('string') betreft;
  @attr('string') currentTypeCommunicatie;
  @attr('string') reactietermijn;
  @hasMany('bericht', { inverse: null }) berichten;
  @belongsTo('bericht', { inverse: null }) laatsteBericht;
}
