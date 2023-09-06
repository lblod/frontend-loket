import { hasMany, belongsTo } from '@ember-data/model';
import OrganizationModel from './organization';

export default class AdministrativeUnitModel extends OrganizationModel {
  @belongsTo('administrative-unit-classification-code', {
    inverse: null,
  })
  classification;

  @belongsTo('location', {
    inverse: 'administrativeUnits',
  })
  locatedWithin;

  @hasMany('governing-body', {
    inverse: 'administrativeUnit',
  })
  governingBodies;

  @hasMany('local-involvement', {
    inverse: 'administrativeUnit',
  })
  involvedBoards;

  @belongsTo('concept', {
    inverse: null,
  })
  exactMatch;

  @belongsTo('location', {
    inverse: null,
  })
  scope;
}
