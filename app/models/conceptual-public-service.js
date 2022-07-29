import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class ConceptualPublicServiceModel extends Model {
  @attr uri;
  @attr('language-string-set') name;
  @attr identifier;
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
  })
  status;

  @belongsTo('concept', {
    inverse: null,
  })
  lifecycleStatus;

  @hasMany('concept', {
    inverse: null,
  })
  sectors;

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
