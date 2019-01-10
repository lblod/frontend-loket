import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  naam: attr(),
  fractietype: belongsTo('fractietype', { inverse: null }),
  bestuursorganenInTijd: hasMany('bestuursorgaan', { inverse: null }),
  bestuurseenheid: belongsTo('bestuurseenheid', { inverse: null })
});
