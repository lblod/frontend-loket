import Model, { belongsTo, hasMany } from '@ember-data/model';

export default class AgentInPositionModel extends Model {
  @belongsTo('post') post;
  @hasMany('contact-punt') contacts;
}
