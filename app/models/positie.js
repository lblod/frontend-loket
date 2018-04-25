import Model from 'ember-data/model';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  rol: belongsTo('rol', { inverse: null }),
  wordtIngevuldDoor: hasMany('persoon', { inverse: null })
});
