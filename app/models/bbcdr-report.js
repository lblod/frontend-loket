import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class BbcdrReportModel extends Model {
  @attr('datetime') created;
  @attr('datetime') modified;
  @belongsTo('document-status') status;
  @belongsTo('gebruiker') lastModifier;
  @belongsTo('bestuurseenheid') bestuurseenheid;
  @hasMany('file') files;
}

