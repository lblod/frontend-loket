import Controller from '@ember/controller';
import { SENT_STATUS } from '../../../models/submission-document-status';

export default class SubsidyApplicationsIndexController extends Controller {
  page = 0;
  size = 20;
  sort = '-modified';
  sentStatus = SENT_STATUS;

  projectName = (consumption) => {
    return consumption.hasMany('subsidyApplicationForms').value()?.at(0)
      ?.projectName;
  };
}
