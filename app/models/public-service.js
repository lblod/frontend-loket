import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class PublicServiceModel extends Model {
  @attr uri;
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
  @attr('datetime') datePublished;
  @attr productId;

  @belongsTo('concept', { async: true, inverse: null }) type;
  @belongsTo('concept', { async: true, inverse: null }) concept;
  @belongsTo('concept', { async: true, inverse: null }) competentAuthority;
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
  @hasMany('bestuurseenheid-classificatie-code', { async: true, inverse: null })
  relevantAdministrativeUnits;
}

/**
 * Returns a list of websites related to the public service starting with the procedure websites and finishing off with the direct website links.
 * @param publicService
 * @returns
 */
export async function getAllWebsites(publicService) {
  const allWebsites = [];
  const procedures = await publicService.procedures;

  for (const procedure of procedures) {
    const procedureWebsites = await procedure.websites;
    allWebsites.push(...procedureWebsites);
  }

  const websites = await publicService.websites;
  allWebsites.push(...websites);

  return allWebsites;
}
