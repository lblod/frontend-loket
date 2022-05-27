import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class ConceptualPublicServiceModel extends Model {
  @attr name;
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

  @hasMany('concept', {
    inverse: null,
  })
  sectors;
}
