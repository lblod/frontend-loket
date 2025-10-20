import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class CollapsibleFieldsetComponent extends Component {
  @tracked _isOpen = null;

  get isOpen() {
    return this._isOpen ?? this.args.isOpenInitially;
  }

  @action
  toggle() {
    this._isOpen = !this.isOpen;
  }

  get iconOpen() {
    return 'nav-down';
  }

  get iconClosed() {
    return 'nav-right';
  }
}
