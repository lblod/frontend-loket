import Model, { attr, belongsTo } from '@ember-data/model';

export default class FileAddressModel extends Model {
  @attr address;

  @belongsTo('file', {
    async: true,
    inverse: null,
  })
  replicatedFile;

  get isValidAddress() {
    if (
      this.address &&
      this.address.match(/^(http|ftp)s?:\/\/[\w.-]+\.\w+(\/.*)?/)
    )
      return true;
    else return false;
  }
}
