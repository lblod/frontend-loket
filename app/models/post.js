import Model, { hasMany, belongsTo } from '@ember-data/model';

export default class PostModel extends Model {
  @belongsTo('role', {
    async: true,
    inverse: null,
  })
  role;

  @hasMany('agent-in-position', {
    async: true,
    inverse: 'post',
    polymorphic: true,
    as: 'post',
  })
  agentsInPosition;
}
