import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class WorshipMinistersManagementNewPersonRoute extends Route {
  @service router;
  @service currentSession;

  beforeModel() {
    if (!this.currentSession.group.hasEditRight) {
      this.router.transitionTo('worship-ministers-management');
    }
  }
  resetController(controller, isExiting) {
    if (isExiting) {
      controller.voornaam = undefined;
      controller.achternaam = undefined;
      controller.rijksregisternummer = undefined;
    }
  }
}
