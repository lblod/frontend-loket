import Component from '@glimmer/component';
import { STATUS } from '../../models/subsidy-measure-consumption-status';

export default class SubsidiesConsumptionStatusPill extends Component {

  get consumption() {
    return this.args.consumption;
  }

  get status() {
    return this.consumption.status;
  }

  get label() {
    let title = this.status.get('label');
    if(this.description)
      return `${title} - ${this.description}`;
    return title;
  }

  get description() {
    if (this.status.get('uri') === STATUS.ACTIVE) {
      const step = this.consumption.get('activeSubsidyApplicationFlowStep.subsidyProceduralStep');
      if (step)
        return step.get('description')
    }
    return undefined;
  }

  get skin() {
    switch (this.status.get('uri')) {
      case STATUS.SENT:
        return 'success';
      case STATUS.ACTIVE:
        return 'action';
      case STATUS.CONCEPT:
        return 'warning';
      default:
        return '';
    }
  }
}
