import { assert } from '@ember/debug';
import { INVALIDATION_REASON } from 'frontend-loket/models/concept';

export default function isMandatarisDeleted(mandataris) {
  const { invalidation } = mandataris;
  assert('invalidation is expected to be loaded here', invalidation);

  return invalidation.type === INVALIDATION_REASON.INVALID;
}
