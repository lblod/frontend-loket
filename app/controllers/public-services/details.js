import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { dropTask } from 'ember-concurrency';
import { isConceptUpdated } from 'frontend-loket/models/public-service';

export default class PublicServicesDetailsController extends Controller {
  // We use a separate flag, otherwise the message would be hidden before the save was actually completed
  @tracked reviewStatus;
  isConceptUpdated = isConceptUpdated;

  get showReviewRequiredMessage() {
    return Boolean(this.reviewStatus);
  }

  @dropTask
  *markAsReviewed() {
    let { publicService } = this.model;
    publicService.reviewStatus = null;

    yield publicService.save();

    this.reviewStatus = null;
  }
}
