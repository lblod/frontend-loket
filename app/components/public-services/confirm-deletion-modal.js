import { action } from '@ember/object';
import Component from '@glimmer/component';
import { dropTask } from 'ember-concurrency';

export default class PublicServicesConfirmDeletionModalComponent extends Component {
  @dropTask
  *delete() {
    yield this.args.data.deleteHandler();
    this.args.close();
  }

  @action
  close() {
    if (this.delete.isIdle) {
      this.args.close();
    }
  }
}
