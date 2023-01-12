import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class EredienstMandatenbeheerMandatarisDetailsController extends Controller {
  @service currentSession;

  get bestuurseenheid() {
    return this.currentSession.group;
  }
}
