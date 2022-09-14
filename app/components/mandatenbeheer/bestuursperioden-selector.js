import Component from '@glimmer/component';
import moment from 'moment';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MandatenbeheerBestuursperiodenSelectorComponent extends Component {
  @tracked _options;

  constructor() {
    super(...arguments);
    this._options = this.args.options || [];
  }

  @action
  selectPeriod(periode) {
    this.args.onSelect(periode);
  }
}
