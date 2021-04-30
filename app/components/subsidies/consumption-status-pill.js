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
    let label = this.status.get('label').toUpperCase();
    if (this.status.get('uri') === STATUS.ACTIVE) {
      const step = this.consumption.get('activeSubsidyApplicationFlowStep.subsidyProceduralStep');
      if (step)
        label = `${label}: ${step.get('description')}`;
    }
    return label;
  }

  get skin() {
    switch (this.status.get('uri')) {
      case STATUS.SENT:
        return 'success';
      case STATUS.ACTIVE:
        return 'action';
      case STATUS.CONCEPT:
        return 'border';
      default:
        return '';
    }
  }
}
