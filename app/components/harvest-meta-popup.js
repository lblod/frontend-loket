import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class HarvestMetaPopupComponent extends Component {
  @tracked modalOpen = false;

  get vendor() {
    return this.args.harvestable?.vendor;
  }

  get harvestSource() {
    return this.args.harvestable?.harvestSource;
  }

  get harvestOriginalUri() {
    return this.args.harvestable?.harvestOriginalUri;
  }

  get harvestDate() {
    return this.args.harvestable?.harvestDate;
  }

  get harvestJob() {
    return this.args.harvestable?.harvestJob;
  }

  get harvestLink() {
    return this.args.harvestable?.harvestLink;
  }

  @action
  toggle() {
    this.modalOpen = !this.modalOpen;
  }
}
