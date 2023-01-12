import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class WorshipMinistersManagementMinisterEditController extends Controller {
  @service currentSession;

  get bestuurseenheid() {
    return this.currentSession.group;
  }
}
