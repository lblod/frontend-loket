import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  start: attr('datetime'),
  einde: attr('datetime'),
  bekleedt: belongsTo('bestuursfunctie', { inverse: null }),
  status: belongsTo('mandataris-status-code', { inverse: null }),
  isBestuurlijkeAliasVan: belongsTo('persoon', { inverse: null })
});
