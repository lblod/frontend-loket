import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class HarvestMetaPopupComponent extends Component {
  @tracked modalOpen = false;

  @action
  toggle() {
    this.modalOpen = !this.modalOpen;
  }
}
