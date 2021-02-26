import Controller from '@ember/controller';
import { SENT_STATUS } from '../../../models/submission-document-status';
import { inject as service } from '@ember/service';

export default class SubsidyApplicationsIndexController extends Controller {
  @service() session;
  page = 0;
  size = 20;
  sort = '-modified';
  sentStatus = SENT_STATUS;
}
