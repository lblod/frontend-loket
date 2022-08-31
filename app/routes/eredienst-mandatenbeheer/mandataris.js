import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class EredienstMandatenbeheerMandatarisRoute extends Route {
  @service store;

  model(params) {
    return this.store.findRecord('worship-mandatee', params.mandateeId, {
      include:
        'is-bestuurlijke-alias-van,bekleedt.bestuursfunctie,type-half,contacts',
    });
  }
}
