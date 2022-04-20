import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class BerichtModel extends Model {
  @attr('datetime') verzonden;
  @attr('datetime') aangekomen;
  @attr inhoud;
  @attr typeCommunicatie;
  @belongsTo('bestuurseenheid') van;
  @belongsTo('gebruiker') auteur;
  @belongsTo('bestuurseenheid') naar;
  @hasMany('file') bijlagen;
}
