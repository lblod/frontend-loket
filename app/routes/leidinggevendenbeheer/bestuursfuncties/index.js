import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  currentSession: service('current-session'),
  async model() {
    this.set('bestuurseenheid', this.modelFor('leidinggevendenbeheer'));
    const bestuurseenheidClassificatie = await (await this.currentSession.group).classificatie;
    this.set('bestuurseenheidClassificatie', bestuurseenheidClassificatie.label);

    return this.store.query('bestuursfunctie', {
      'filter[bevat-in][is-tijdsspecialisatie-van][bestuurseenheid][:id:]':this.bestuurseenheid.id
    });
  },

  setupController(controller, model) {
    this._super(controller, model);
    if(this.bestuurseenheidClassificatie !== "OCMW") {
      controller.set('allowed', true);
    }
    controller.set('bestuurseenheid', this.bestuurseenheid);
  }
});
