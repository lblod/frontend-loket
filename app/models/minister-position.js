import { belongsTo, hasMany } from '@ember-data/model';
import Post from './post';

export default class MinisterPositionModel extends Post {
  @belongsTo('minister-position-function', { inverse: null }) function;

  @belongsTo('worship-administrative-unit', {
    inverse: 'ministerPositions',
    polymorphic: true,
    as: 'minister-position',
  })
  worshipService;

  @belongsTo('representative-body', { inverse: 'ministerPosition' })
  representativeBody;

  @hasMany('minister', { inverse: 'ministerPosition' }) heldByMinisters;
}
