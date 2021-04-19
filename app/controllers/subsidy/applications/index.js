import Controller from '@ember/controller';
import { SENT_STATUS } from '../../../models/submission-document-status';
import { action } from '@ember/object';

export default class SubsidyApplicationsIndexController extends Controller {
  page = 0;
  size = 20;
  sort = '-modified';
  sentStatus = SENT_STATUS;

  @action
  async toActiveStep(consumption){
    const step = await consumption.get('activeSubsidyApplicationFlowStep');
    this.transitionToRoute('subsidy.applications.edit.step.edit', consumption.id, step.id);
  }
}
