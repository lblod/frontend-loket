import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

export default class MandatenbeheerMandatarissenEditRoute extends Route {
  @service store;

  async model(params) {
    const parentModel = this.modelFor('mandatenbeheer');
    const persoon = await this.store.findRecord('persoon', params.id);

    return RSVP.hash({
      bestuurseenheid: parentModel.bestuurseenheid,
      bestuursorganen: parentModel.bestuursorganen,
      persoon,
    });
  }
}
