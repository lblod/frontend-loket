import Model, { attr } from '@ember-data/model';

export default class DocumentStatusModel extends Model {
  @attr uri;
  @attr label;

  get isConcept() {
    return this.uri === DOCUMENT_STATUS.CONCEPT;
  }

  get isVerstuurd() {
    return this.uri === DOCUMENT_STATUS.VERSTUURD;
  }
}

export const DOCUMENT_STATUS = {
  CONCEPT: 'http://data.lblod.info/document-statuses/concept',
  GOEDGEKEURD: 'http://data.lblod.info/document-statuses/goedgekeurd',
  OPMERKING: 'http://data.lblod.info/document-statuses/opmerking',
  VERSTUURD: 'http://data.lblod.info/document-statuses/verstuurd',
  PRULLENBAK: 'http://data.lblod.info/document-statuses/prullenbak',
};
