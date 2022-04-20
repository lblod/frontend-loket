import Model, { attr } from '@ember-data/model';

export default class SubmissionDocumentStatus extends Model {
  @attr uri;
  @attr label;

  get isSent() {
    return this.uri === SENT_STATUS;
  }
}

const NEW_STATUS =
  'http://lblod.data.gift/concepts/6b7ae118-4653-48f2-9d9a-4712f8c30da9';
const CONCEPT_STATUS =
  'http://lblod.data.gift/concepts/79a52da4-f491-4e2f-9374-89a13cde8ecd';
const SENT_STATUS =
  'http://lblod.data.gift/concepts/9bd8d86d-bb10-4456-a84e-91e9507c374c';
const DELETED_STATUS =
  'http://lblod.data.gift/concepts/faa5110a-fdb2-47fa-a0d2-118e5542ef05';

export { NEW_STATUS, CONCEPT_STATUS, SENT_STATUS, DELETED_STATUS };
