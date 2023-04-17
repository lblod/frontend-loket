import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { dropTask, task } from 'ember-concurrency';
import {
  hasConcept,
  isConceptUpdated,
} from 'frontend-loket/models/public-service';

export default class PublicServicesDetailsController extends Controller {
  // We use a separate flag, otherwise the message would be hidden before the save was actually completed
  @tracked reviewStatus;
  @tracked shouldShowUnlinkWarning = false;
  isConceptUpdated = isConceptUpdated;

  get showReviewRequiredMessage() {
    return Boolean(this.reviewStatus);
  }

  get hasConcept() {
    return hasConcept(this.model.publicService);
  }

  get canUnlinkConcept() {
    const { publicService } = this.model;

    return (
      this.hasConcept && !publicService.isSent && !this.shouldShowUnlinkWarning
    );
  }

  @action
  showUnlinkWarning() {
    this.shouldShowUnlinkWarning = true;
  }

  @action
  hideUnlinkWarning() {
    this.shouldShowUnlinkWarning = false;
  }

  @dropTask
  *markAsReviewed() {
    let { publicService } = this.model;
    publicService.reviewStatus = null;

    yield publicService.save();

    this.reviewStatus = null;
  }

  unlinkConcept = task({ drop: true }, async () => {
    const { publicService } = this.model;
    publicService.concept = null;
    publicService.modified = new Date();
    await publicService.save();

    this.hideUnlinkWarning();
  });
}
