import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class PublicServicesConceptDetailsController extends Controller {
  queryParams = [{ isPreview: 'preview', publicServiceId: 'id' }];
  isPreview = false;
  publicServiceId = '';

  get isLinkFlowPreview() {
    return Boolean(this.publicServiceId);
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
