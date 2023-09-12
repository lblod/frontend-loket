import Model, { attr, belongsTo } from '@ember-data/model';

export default class VerkiezingsresultaatModel extends Model {
  @attr aantalNaamstemmen;
  @attr plaatsRangorde;
  @belongsTo('persoon', {
    async: true,
    inverse: null,
  })
  isResultaatVan;

  @belongsTo('kandidatenlijst', {
    async: true,
    inverse: null,
  })
  isResultaatVoor;

  @belongsTo('verkiezingsresultaat-gevolg-code', {
    async: true,
    inverse: null,
  })
  gevolg;
}
