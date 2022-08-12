import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class PublicServicesSubmitErrorModalComponent extends Component {
  @tracked submitErrorMessage;
  @tracked showSubmitErrorModal = true;

  @action
  closeSubmitErrorModal() {
    this.args.close();
  }
}
