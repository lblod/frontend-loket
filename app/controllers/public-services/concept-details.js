import Controller from '@ember/controller';
import { action } from '@ember/object';

const ARCHIVED_STATUS =
  'http://lblod.data.gift/concepts/3f2666df-1dae-4cc2-a8dc-e8213e713081';

export default class PublicServicesConceptDetailsController extends Controller {
  queryParams = [{ isPreview: 'preview', publicServiceId: 'id' }];
  isPreview = false;
  publicServiceId = '';

  get isLinkFlowPreview() {
    return Boolean(this.publicServiceId);
  }

  get isArchived() {
    return this.model.concept.status?.uri === ARCHIVED_STATUS;
  }

  @action async hideNewConceptMessage() {
    const { displayConfiguration } = this.model.concept;
    displayConfiguration.isNewConcept = false;
    try {
      await displayConfiguration.save();
    } catch (error) {
      // TODO: Something went wrong while saving, but a fully fledged error state seems overkill. We should send a message to GlitchTip.
    }
  }
}
