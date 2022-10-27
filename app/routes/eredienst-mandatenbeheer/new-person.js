import Route from '@ember/routing/route';

export default class EredienstMandatenbeheerNewPersonRoute extends Route {
  resetController(controller, isExiting) {
    if (isExiting) {
      controller.voornaam = undefined;
      controller.achternaam = undefined;
      controller.rijksregisternummer = undefined;
    }
  }
}
