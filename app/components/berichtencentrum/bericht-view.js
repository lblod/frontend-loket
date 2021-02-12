import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class BerichtencentrumBerichtViewComponent extends Component {
  @tracked isExpanded = false

  @action
    expand() {
      this.isExpanded = !this.isExpanded;
    }
  }
