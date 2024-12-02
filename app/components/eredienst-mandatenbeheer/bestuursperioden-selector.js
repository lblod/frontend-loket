import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { sortByStartDate } from 'frontend-loket/utils/eredienst-mandatenbeheer';

export default class MandatenbeheerBestuursperiodenSelectorComponent extends Component {
  @tracked _options;

  constructor() {
    super(...arguments);
    this._options = Array.isArray(this.args.options)
      ? sortByStartDate(this.args.options)
      : [];
  }

  @action
  selectPeriod(periode) {
    this.args.onSelect(periode);
  }
}
