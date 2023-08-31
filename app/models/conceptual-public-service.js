import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class ConceptualPublicServiceModel extends Model {
  @attr uri;
  @attr productId;
  @attr('language-string-set') name;
  @attr('datetime') startDate;
  @attr('datetime') endDate;
  @attr('datetime') created;
  @attr('datetime') modified;

  @belongsTo('concept', {
    async: true,
    inverse: null,
  })
  type;

  @belongsTo('concept', {
    async: false,
    inverse: null,
  })
  status;

  @belongsTo('concept-display-configuration', {
    async: false,
    inverse: null,
  })
  displayConfiguration;

  @hasMany('concept', {
    async: true,
    inverse: null,
  })
  conceptTags;

  @hasMany('concept', {
    async: true,
    inverse: null,
  })
  targetAudiences;

  @hasMany('concept', {
    async: true,
    inverse: null,
  })
  competentAuthorityLevels;

  @hasMany('concept', {
    async: true,
    inverse: null,
  })
  executingAuthorityLevels;

  get nameNl() {
    if (this.name?.length) {
      const nameNl = this.name.find((name) => name.language == 'nl');
      if (nameNl) {
        return nameNl.content;
      } else return this.name[0].content; //gracious fallback
    } else {
      return null;
    }
  }
}
