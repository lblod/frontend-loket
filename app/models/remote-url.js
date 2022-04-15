import Model, { attr, belongsTo } from '@ember-data/model';

export default class AutomaticSubmissionTask extends Model {
  @attr uri;
  @attr address;
  @attr('date') created;
  @attr('date') modified;
  @belongsTo('file', { inverse: null }) download;
  @attr downloadStatus;
  @attr creator;

  get downloadLink() {
    return `/files/${this.id}/download`;
  }

  get downloadSuccess() {
    return (
      this.downloadStatus ===
      'http://lblod.data.gift/file-download-statuses/success'
    );
  }

  get downloadOngoing() {
    const ongoingStatuses = [
      'http://lblod.data.gift/file-download-statuses/ongoing',
      'http://lblod.data.gift/file-download-statuses/ready-to-be-cached',
    ];
    return ongoingStatuses.includes(this.downloadStatus);
  }

  get downloadFailed() {
    return (
      this.downloadStatus ===
      'http://lblod.data.gift/file-download-statuses/failure'
    );
  }
}
