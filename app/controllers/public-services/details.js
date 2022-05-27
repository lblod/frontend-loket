import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class PublicServicesDetailsController extends Controller {
  @service router;

  @action
  removePublicService() {
    // TODO: delete the record in the database

    this.router.replaceWith('public-services');
  }
}
