import Model from 'ember-data/model';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  contactinfo: belongsTo('contact-punt'),
  bevatIn: hasMany('bestuursorgaan'),
  bestuursfunctieCode: belongsTo('bestuurs-functie-code')
});
