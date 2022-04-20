import Model, { attr, belongsTo } from '@ember-data/model';

export default class FunctionarisModel extends Model {
  @attr uri;
  @attr('datetime') start;
  @attr('datetime') einde;
  @belongsTo('bestuursfunctie', { inverse: null }) bekleedt;
  @belongsTo('functionaris-status-code', { inverse: null }) status;
  @belongsTo('persoon', { inverse: null }) isBestuurlijkeAliasVan;

  get datesAreCompatible() {
    return this.start && this.einde && this.einde > this.start;
  }
}
