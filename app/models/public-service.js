import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class PublicServiceModel extends Model {
  @attr('string') uri;
  @attr('language-string-set') name;
  @attr('language-string-set') description;
  @attr('language-string-set') additionalDescription;
  @attr('language-string-set') keyword;
  @attr('language-string-set') regulations;
  @attr('language-string-set') exceptions;
  @attr('datetime') startDate;
  @attr('datetime') endDate;
  @attr('datetime') dateCreated;
  @attr('datetime') dateModified;
  @attr('string') productId;
  @belongsTo('concept', { async: true, inverse: null }) type;
  @belongsTo('concept', { async: true, inverse: null }) concept;
  @hasMany('concept', { async: true, inverse: null }) languages;
  @hasMany('concept', { async: true, inverse: null }) targetAudiences;
  @hasMany('concept', { async: true, inverse: null }) thematicAreas;
  @hasMany('concept', { async: true, inverse: null })
  competentAuthorityLevels;
  @hasMany('concept', { async: true, inverse: null })
  executingAuthorityLevels;
  @hasMany('website', { async: true, inverse: 'publicService' })
  websites;
  @hasMany('procedure', { async: true, inverse: 'publicService' })
  procedures;
}
