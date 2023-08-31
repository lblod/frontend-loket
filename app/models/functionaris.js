import Model, { attr, belongsTo } from '@ember-data/model';

export default class FunctionarisModel extends Model {
  @attr uri;
  @attr('datetime') start;
  @attr('datetime') einde;

  @belongsTo('bestuursfunctie', {
    async: true,
    inverse: null,
  })
  bekleedt;

  @belongsTo('functionaris-status-code', {
    async: true,
    inverse: null,
  })
  status;

  @belongsTo('persoon', {
    async: true,
    inverse: null,
  })
  isBestuurlijkeAliasVan;

  get datesAreCompatible() {
    return this.start && this.einde && this.einde > this.start;
  }
}
