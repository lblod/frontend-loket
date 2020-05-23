import Model, {attr} from '@ember-data/model';

export default class SubmissionDocumentStatus extends Model {
  @attr uri;
  @attr('string') label;

  get isSent() {
    return this.uri == SENT_STATUS;
  }
}

const CONCEPT_STATUS = 'http://lblod.data.gift/concepts/79a52da4-f491-4e2f-9374-89a13cde8ecd';
const SENT_STATUS = 'http://lblod.data.gift/concepts/9bd8d86d-bb10-4456-a84e-91e9507c374c';
const DELETED_STATUS = 'http://lblod.data.gift/concepts/faa5110a-fdb2-47fa-a0d2-118e5542ef05';

export {
  CONCEPT_STATUS,
  SENT_STATUS,
  DELETED_STATUS
}
