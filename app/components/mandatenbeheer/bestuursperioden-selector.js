import Component from '@glimmer/component';
import moment from 'moment';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MandatenbeheerBestuursperiodenSelectorComponent extends Component {
  @tracked _options;

  getUniqueBestuursperiodes(bestuursorganen) {
    let options = bestuursorganen
      .map((b) => {
        return { bindingStart: b.bindingStart, bindingEinde: b.bindingEinde };
      })
      .sortBy('bindingStart')
      .reverse();
    return options.filter(
      (o, i) =>
        options
          .map((periode) => JSON.stringify(periode))
          .indexOf(JSON.stringify(o)) === i
    );
  }

  constructor() {
    super(...arguments);
    this._options = this.getUniqueBestuursperiodes(this.args.options) || [];
  }

  get selectedBestuursorgaan() {
    if (this.args.selectedStartDate && this.args.selectedEndDate) {
      return this._options.find((o) => {
        return (
          o.bindingStart.toDateString() ==
            new Date(this.args.selectedStartDate).toDateString() &&
          o.bindingEinde?.toDateString() ==
            new Date(this.args.selectedEndDate).toDateString()
        );
      });
    } else if (this.args.selectedStartDate) {
      return this._options.find((o) => {
        return (
          o.bindingStart.toDateString() ==
            new Date(this.args.selectedStartDate).toDateString() &&
          !o.bindingEinde
        );
      });
    } else {
      return this._options[0];
    }
  }

  @action
  selectBestuursorgaan(periode) {
    const start = moment(periode.bindingStart).format('YYYY-MM-DD');
    const einde = periode.bindingEinde
      ? moment(periode.bindingEinde).format('YYYY-MM-DD')
      : null;
    this.args.onSelect(start, einde);
  }
}
