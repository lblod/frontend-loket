import { action } from '@ember/object';
import Component from '@glimmer/component';
import { dropTask } from 'ember-concurrency';

export default class PublicServicesConfirmDiscardChangesModalComponent extends Component {
  @dropTask
  *save() {
    yield this.args.data.saveHandler();

    let shouldTransition = true;
    this.args.close(shouldTransition);
  }

  @action
  discardChanges() {
    if (this.save.isIdle) {
      let shouldTransition = true;
      this.args.close(shouldTransition);
    }
  }

  @action
  cancel() {
    if (this.save.isIdle) {
      let shouldTransition = false;
      this.args.close(shouldTransition);
    }
  }
}
