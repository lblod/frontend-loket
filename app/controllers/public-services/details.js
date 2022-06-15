import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import ConfirmDeletionModal from 'frontend-loket/components/public-services/confirm-deletion-modal';

export default class PublicServicesDetailsController extends Controller {
  @service router;
  @service modals;

  @action
  removePublicService() {
    this.modals.open(ConfirmDeletionModal, {
      deleteHandler: async () => {
        await this.model.publicService.destroyRecord();
        this.router.replaceWith('public-services');
      },
    });
  }
}
