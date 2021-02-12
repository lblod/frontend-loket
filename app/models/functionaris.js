import Model, { attr, belongsTo } from '@ember-data/model';
import { collect } from '@ember/object/computed';

export default class FunctionarisModel extends Model {
  // A string representation of this model, based on its attributes.
  // This is what mu-cl-resources uses to search on, and how the model will be presented while editing relationships.
  @collect.apply(this,['id', 'start', 'einde']) stringRep;
  @attr() uri;
  @attr('datetime') start;
  @attr('datetime') einde;
  @belongsTo('bestuursfunctie', { inverse: null }) bekleedt;
  @belongsTo('functionaris-status-code', { inverse: null }) status;
  @belongsTo('persoon', { inverse: null }) isBestuurlijkeAliasVan;

  get datesAreCompatible() {
    return this.start && this.einde && this.einde > this.start;
  }
}

