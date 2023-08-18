import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class BerichtModel extends Model {
  @attr('datetime') verzonden;
  @attr('datetime') aangekomen;
  @attr inhoud;
  @attr typeCommunicatie;

  @belongsTo('bestuurseenheid', {
    async: true,
    inverse: null,
  })
  van;

  @belongsTo('gebruiker', {
    async: true,
    inverse: null,
  })
  auteur;

  @belongsTo('bestuurseenheid', {
    async: true,
    inverse: null,
  })
  naar;

  @hasMany('file', {
    async: true,
    inverse: null,
  })
  bijlagen;
}
