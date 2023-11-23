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

  //Save message as the last thing
  //  → see vendor-data-distribution-service
  //It needs the `creator` prop to make the data transactionaly available
  //to the Vendor API. All the data needs to exist at that point.
  @attr({ defaultValue: 'https://github.com/lblod/frontend-loket' }) creator;

  @belongsTo('bestuurseenheid', {
    async: false,
    inverse: null,
    polymorphic: true,
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
    polymorphic: true,
  })
  naar;

  @hasMany('file', {
    async: false,
    inverse: null,
  })
  bijlagen;
}
