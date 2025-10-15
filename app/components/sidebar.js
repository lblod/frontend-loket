import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class Sidebar extends Component {
  @tracked open = false;

  @action
  toggleSidebar() {
    this.open = !this.open;
  }

  @action
  closeSidebar() {
    this.open = false;
  }
}
