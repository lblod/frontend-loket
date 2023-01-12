import Route from '@ember/routing/route';
export default class EredienstMandatenbeheerMandatarisDetailsRoute extends Route {
  model() {
    return this.modelFor('eredienst-mandatenbeheer.mandataris');
  }
}
