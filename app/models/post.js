import Model, { belongsTo } from '@ember-data/model';

export default class PostModel extends Model {
  @belongsTo('role', { inverse: null }) role;
}
