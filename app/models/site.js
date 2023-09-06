import Model, { hasMany, belongsTo } from '@ember-data/model';

export default class SiteModel extends Model {
  @belongsTo('address', {
    inverse: null,
  })
  address;

  @hasMany('contact-point', {
    inverse: null,
  })
  contacts;

  @belongsTo('site-type', {
    inverse: null,
  })
  siteType;
}
