import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  naam: attr(),
  primaireSite: belongsTo('vestiging', { inverse: null }),
  contactinfo: hasMany('contact-punt', { inverse: null }),
  posities: hasMany('positie', { inverse: null })
});
