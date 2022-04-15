import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class BerichtModel extends Model {
  @attr('datetime') verzonden;
  @attr('datetime') aangekomen;
  @attr('string') inhoud;
  @attr('string') typeCommunicatie;
  @belongsTo('bestuurseenheid') van;
  @belongsTo('gebruiker') auteur;
  @belongsTo('bestuurseenheid') naar;
  @hasMany('file') bijlagen;
}
