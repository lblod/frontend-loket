import Model, { belongsTo, hasMany } from '@ember-data/model';

export default class PostModel extends Model {
  @belongsTo('role') role;
}
