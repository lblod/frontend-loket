import Component from '@glimmer/component';
import { STATUS } from '../../models/subsidy-measure-consumption-status';

export default class SubsidiesConsumptionStatusPill extends Component {

  get status() {
    return this.args.consumption.status;
  }

  get skin() {
    switch(this.status.get('uri')) {
      case STATUS.SENT:
        return "success"
      case STATUS.ACTIVE:
        return "action"
      case STATUS.CONCEPT:
        return "border"
      default:
        return ""
    }
  }
}
