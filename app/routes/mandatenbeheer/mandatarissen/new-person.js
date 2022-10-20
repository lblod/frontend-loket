import Route from '@ember/routing/route';

export default class MandatenbeheerMandatarissenNewPersonRoute extends Route {
  resetController(controller, isExiting) {
    if (isExiting) {
      controller.voornaam = undefined;
      controller.achternaam = undefined;
      controller.rijksregisternummer = undefined;
    }
  }
}
