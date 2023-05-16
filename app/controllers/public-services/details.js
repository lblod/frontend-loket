import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { dropTask, task } from 'ember-concurrency';
import {
  hasConcept,
  isConceptUpdated,
} from 'frontend-loket/models/public-service';
import { inject as service } from '@ember/service';

export default class PublicServicesDetailsController extends Controller {
  @service store;

  // We use a separate flag, otherwise the message would be hidden before the save was actually completed
  @tracked reviewStatus;
  @tracked shouldShowUnlinkWarning = false;
  isConceptUpdated = isConceptUpdated;

  get showReviewRequiredMessage() {
    return Boolean(this.reviewStatus);
  }

  get canLinkConcept() {
    const { publicService } = this.model;

    return !hasConcept(publicService) && !publicService.isSent;
  }

  get canUnlinkConcept() {
    const { publicService } = this.model;

    return (
      hasConcept(publicService) &&
      !publicService.isSent &&
      !this.shouldShowUnlinkWarning
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
    const currentConcept = await publicService.concept;
    publicService.concept = null;
    publicService.modified = new Date();
    await publicService.save();

    if (!(await hasInstances(this.store, currentConcept))) {
      const displayConfiguration = await currentConcept
        .belongsTo('displayConfiguration')
        .reload(); // `.reload` is needed since Ember Data considers sync relationships that didn't include data "empty" and it would instantly return null if we used `.load` instead
      displayConfiguration.isInstantiated = false;
      await displayConfiguration.save();
    }

    this.hideUnlinkWarning();
  });
}

async function hasInstances(store, concept) {
  const servicesWithConcept = await store.query('public-service', {
    'filter[concept][:id:]': concept.id,
  });

  return servicesWithConcept.length > 0;
}
