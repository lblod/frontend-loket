import { collect } from '@ember/object/computed';
import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class BestuursfunctieModel extends Model {
  // A string representation of this model, based on its attributes.
  // This is what mu-cl-resources uses to search on, and how the model will be presented while editing relationships.
  @collect.apply(this, ['id']) stringRep;

  @attr uri;
  @belongsTo('bestuursfunctie-code', { inverse: null }) rol;
  @belongsTo('contact-punt', { inverse: null }) contactinfo;
  @hasMany('bestuursorgaan', { inverse: null }) bevatIn;
}
