import Model, { belongsTo, hasMany } from '@ember-data/model';
import Post from './post';

export default class MinisterPositionModel extends Post {
  @belongsTo('minister-position-function') function;
  @belongsTo('worship-administrative-unit', { inverse: null })
  worshipService;
  @belongsTo('representative-body') representationBody;

  @hasMany('minister', { inverse: null }) heldByMinisters;
}
