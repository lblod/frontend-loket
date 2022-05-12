import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { addedMockPublicServices } from 'frontend-loket/mock-data/public-services';

export default class PublicServicesDetailsController extends Controller {
  @service router;

  @action
  removePublicService() {
    // TODO: replace this with a backend call
    let index = addedMockPublicServices.indexOf(this.model.publicService);
    addedMockPublicServices.splice(index, 1);

    this.router.replaceWith('public-services');
  }
}
