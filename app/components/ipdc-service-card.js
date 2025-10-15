import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class IpdcServiceCardComponent extends Component {
  @action
  handleClick(e) {
    const isFavoriteToggle = e.target.closest('.favorite-toggle-container');
    if (!isFavoriteToggle) {
      this.args.onClick(this.args.model);
    }
  }
}
