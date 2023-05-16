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
    inverse: null,
  })
  type;

  @belongsTo('concept', {
    inverse: null,
    async: false,
  })
  status;

  @belongsTo('concept-display-configuration', {
    inverse: null,
    async: false,
  })
  displayConfiguration;

  @hasMany('concept', {
    inverse: null,
  })
  conceptTags;

  @hasMany('concept', {
    inverse: null,
  })
  targetAudiences;

  @hasMany('concept', {
    inverse: null,
  })
  competentAuthorityLevels;

  @hasMany('concept', {
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
