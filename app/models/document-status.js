import Model, { attr } from '@ember-data/model';
import { equal } from '@ember/object/computed';

export default class DocumentStatusModel extends Model {
  @attr uri;
  @attr label;

  @equal('uri', 'http://data.lblod.info/document-statuses/concept') isConcept;
  @equal('uri', 'http://data.lblod.info/document-statuses/verstuurd')
  isVerstuurd;
}
