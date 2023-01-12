import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class WorshipMinistersManagementIndexController extends Controller {
  @service currentSession;
  @tracked sort = 'person.gebruikte-voornaam';
  @tracked page = 0;
  @tracked size = 20;

  get bestuurseenheid() {
    return this.currentSession.group;
  }
}
