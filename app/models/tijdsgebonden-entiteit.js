import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  bindingEinde: attr('date'),
  bindingStart: attr('date'),
  isTijdsspecialisatieVan: belongsTo('entiteit', { inverse: null })
});
