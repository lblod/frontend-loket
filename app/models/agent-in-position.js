import Model, { belongsTo, hasMany } from '@ember-data/model';

export default class AgentInPositionModel extends Model {
  @belongsTo('post', { inverse: null }) post;
  @hasMany('contact-punt', { inverse: null }) contacts;
}
