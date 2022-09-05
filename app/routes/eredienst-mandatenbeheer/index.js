import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class EredienstMandatenbeheerIndexRoute extends Route {
  @service router;
  beforeModel() {
    return this.router.replaceWith('eredienst-mandatenbeheer.mandatarissen');
  }
}
