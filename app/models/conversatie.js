import DS from 'ember-data';
import { hasMany, belongsTo }  from 'ember-data/relationships';
const { attr } = DS;

export default DS.Model.extend({
  dossiernummer: attr('string'),
  betreft: attr('string'),
  typeCommunicatie: attr('string'),
  reactietermijn: attr('string'),
  berichten: hasMany('bericht', { inverse: null }),
  laatsteBericht: belongsTo('bericht', { inverse: null })
});
