import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class BbcdrReportModel extends Model {
  @attr('datetime') created;
  @attr('datetime') modified;

  @belongsTo('document-status', {
    async: false,
    inverse: null,
  })
  status;

  @belongsTo('gebruiker', {
    async: false,
    inverse: null,
  })
  lastModifier;

  @belongsTo('bestuurseenheid', {
    async: false,
    inverse: null,
  })
  bestuurseenheid;

  @hasMany('file', {
    async: false,
    inverse: null,
  })
  files;
}
