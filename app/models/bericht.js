import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export const COMMUNICATION_TYPES = {
  KENNISGEVING: 'Kennisgeving toezichtsbeslissing',
  OPVRAGING: 'Opvraging',
  REACTIE: 'Reactie',
};

export default class BerichtModel extends Model {
  @attr('datetime') verzonden;
  @attr('datetime') aangekomen;
  @attr inhoud;
  @attr typeCommunicatie;
  @attr creator;

  @belongsTo('bestuurseenheid', {
    async: false,
    inverse: null,
  })
  van;

  @belongsTo('gebruiker', {
    async: false,
    inverse: null,
  })
  auteur;

  @belongsTo('bestuurseenheid', {
    async: false,
    inverse: null,
  })
  naar;

  @hasMany('file', {
    async: false,
    inverse: null,
  })
  bijlagen;
}
