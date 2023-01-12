import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
export default class EredienstMandatenbeheerNewPersonRoute extends Route {
  @service currentSession;
  @service router;

  beforeModel() {
    if (!this.currentSession.group.hasEditRight) {
      this.router.transitionTo('eredienst-mandatenbeheer.mandatarissen');
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
