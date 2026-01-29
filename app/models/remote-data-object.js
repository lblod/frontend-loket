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

  get downloadLink() {
    return `/files/${this.id}/download`;
  }

  get downloadSuccess() {
    return (
      this.status ===
      'http://lblod.data.gift/file-download-statuses/success'
    );
  }

  get downloadOngoing() {
    const ongoingStatuses = [
      'http://lblod.data.gift/file-download-statuses/ongoing',
      'http://lblod.data.gift/file-download-statuses/ready-to-be-cached',
    ];
    return ongoingStatuses.includes(this.status);
  }

  get downloadFailed() {
    return (
      this.status ===
      'http://lblod.data.gift/file-download-statuses/failure'
    );
  }
}
