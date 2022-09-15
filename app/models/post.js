import Model, { hasMany, belongsTo } from '@ember-data/model';

export default class PostModel extends Model {
  @belongsTo('role', { inverse: null }) role;

  @hasMany('agent-in-position', { inverse: 'post' }) agentsInPosition;
}
