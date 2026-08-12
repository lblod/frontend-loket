import Model, { attr, belongsTo, hasMany } from '@warp-drive/legacy/model';

export default class ProcedureModel extends Model {
  @attr uri;
  @attr('language-string-set') name;
  @attr('language-string-set') description;
  @belongsTo('public-service', { async: true, inverse: 'procedures' })
  publicService;
  @hasMany('website', { async: true, inverse: 'procedure' })
  websites;
}
