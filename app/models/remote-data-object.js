import Model, { attr, belongsTo } from '@ember-data/model';

export default class RemoteDataObjectModel extends Model {
  @attr uri;
  @attr source;
  @attr('date') created;
  @attr('date') modified;
  @attr requestHeader;
  @attr status;
  @attr comment;
  @attr creator;

  @belongsTo('file', {
    async: true,
    inverse: null,
  })
  file;

  // Omitted:
  //@attr harvesting-collection
  //@attr authentication-configuration
}
