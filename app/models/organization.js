import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class OrganizationModel extends Model {
  @attr name;
  @attr alternativeName;
  @attr('date') expectedEndDate;
  @attr purpose;

  @belongsTo('site', {
    inverse: null,
  })
  primarySite;

  @belongsTo('organization-status-code', {
    inverse: null,
  })
  organizationStatus;

  @hasMany('identifier', {
    inverse: null,
  })
  identifiers;

  @hasMany('site', {
    inverse: null,
  })
  sites;

  @hasMany('change-event', {
    inverse: 'originalOrganizations',
  })
  changedBy;

  @hasMany('change-event', {
    inverse: 'resultingOrganizations',
  })
  resultedFrom;

  @hasMany('change-event-result', {
    inverse: 'resultingOrganization',
  })
  changeEventResults;

  @hasMany('post', {
    inverse: null,
  })
  positions;

  @hasMany('organization', {
    inverse: 'isSubOrganizationOf',
  })
  subOrganizations;

  @belongsTo('organization', {
    inverse: 'subOrganizations',
  })
  isSubOrganizationOf;

  @hasMany('organization', {
    inverse: 'isAssociatedWith',
  })
  associatedOrganizations;

  @belongsTo('organization', {
    inverse: 'associatedOrganizations',
  })
  isAssociatedWith;

  @hasMany('organization', {
    inverse: 'wasFoundedByOrganization',
  })
  foundedOrganizations;

  @belongsTo('organization', {
    inverse: 'foundedOrganizations',
  })
  wasFoundedByOrganization;

  @hasMany('organization', {
    inverse: 'hasParticipants',
  })
  participatesIn;

  @hasMany('organization', {
    inverse: 'participatesIn',
  })
  hasParticipants;
}
