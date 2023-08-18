import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class BbcdrReportModel extends Model {
  @attr('datetime') created;
  @attr('datetime') modified;

  @belongsTo('document-status', {
    async: true,
    inverse: null,
  })
  status;

  @belongsTo('gebruiker', {
    async: true,
    inverse: null,
  })
  lastModifier;

  @belongsTo('bestuurseenheid', {
    async: true,
    inverse: null,
  })
  bestuurseenheid;

  @hasMany('file', {
    async: true,
    inverse: null,
  })
  files;
}
