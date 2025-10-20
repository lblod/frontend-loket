import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { modifier } from 'ember-modifier';
import TilesIcon from './icons/tiles';
import StarOutlineIcon from './icons/star-outline';
import SubsidiesIcon from './icons/subsidies';

export default class NavigationComponent extends Component {
  @service router;

  @tracked referenceElement = undefined;
  @tracked arrowElement = undefined;
  @tracked dropdownOpen = false;

  TilesIcon = TilesIcon;
  StarOutlineIcon = StarOutlineIcon;
  SubsidiesIcon = SubsidiesIcon;

  get activeTileLabel() {
    if (this.router.currentRouteName.startsWith('search')) {
      return 'Alle diensten';
    } else if (this.router.currentRouteName.startsWith('favorites')) {
      return 'Mijn favorieten';
    } else {
      return this.router.currentRouteName;
    }
  }

  reference = modifier(
    (element) => {
      this.referenceElement = element;
    },
    { eager: false },
  );

  arrow = modifier(
    (element) => {
      this.arrowElement = element;
    },
    { eager: false },
  );

  @action
  openDropdown() {
    this.dropdownOpen = true;
  }

  @action
  closeDropdown() {
    this.dropdownOpen = false;
    this.args.onClose?.();
  }

  @action
  toggleDropdown() {
    this.dropdownOpen ? this.closeDropdown() : this.openDropdown();
  }

  @action
  clickOutsideDeactivates(event) {
    let isClosedByToggleButton = this.referenceElement.contains(event.target);

    if (!isClosedByToggleButton) {
      this.closeDropdown();
    }

    return true;
  }
}
