import { belongsTo } from '@ember-data/model';
import ConceptualPublicServiceModel from './conceptual-public-service';

export default class PublicServiceModel extends ConceptualPublicServiceModel {
  @belongsTo('conceptual-public-service', { inverse: null })
  concept;

  @belongsTo('concept', { async: false, inverse: null })
  reviewStatus;

  get isSent() {
    return (
      this.status?.uri ===
      'http://lblod.data.gift/concepts/9bd8d86d-bb10-4456-a84e-91e9507c374c'
    );
  }
}

export function serviceNeedsReview(publicService) {
  return Boolean(publicService.reviewStatus);
}

const REVIEW_STATUS = {
  UPDATED:
    'http://lblod.data.gift/concepts/5a3168e2-f39b-4b5d-8638-29f935023c83',
  DELETED:
    'http://lblod.data.gift/concepts/cf22e8d1-23c3-45da-89bc-00826eaf23c3',
};

export function isConceptUpdated(reviewStatus) {
  return reviewStatus?.uri === REVIEW_STATUS.UPDATED;
}

export function isConceptDeleted(reviewStatus) {
  return reviewStatus?.uri === REVIEW_STATUS.DELETED;
}

export function hasConcept(publicService) {
  // This assumes the relationship was already loaded. Either by using includes, or by resolving the promise.
  // Otherwise this will always return false
  return Boolean(publicService.belongsTo('concept').id());
}
