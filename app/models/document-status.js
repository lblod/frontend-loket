import Model, { attr } from '@ember-data/model';

export default class DocumentStatusModel extends Model {
  @attr uri;
  @attr label;

  get isConcept() {
    return this.uri === 'http://data.lblod.info/document-statuses/concept';
  }

  get isVerstuurd() {
    return this.uri === 'http://data.lblod.info/document-statuses/verstuurd';
  }
}
