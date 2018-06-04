import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  naam: attr(),
  fractietype: belongsTo('fractietype', { inverse: null }),
  bestuursOrganenInTijd: belongsTo('bestuursorgaan', { inverse: null }),
  bestuurseenheid: belongsTo('bestuurseenheid', { inverse: null })
});
