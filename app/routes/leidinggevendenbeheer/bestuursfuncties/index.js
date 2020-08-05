import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  currentSession: service('current-session'),
  async model() {
    this.set('bestuurseenheid', this.modelFor('leidinggevendenbeheer'));
    const bestuurseenheidClassificatie = await (await this.currentSession.group).classificatie;
    this.set('bestuurseenheidClassificatie', bestuurseenheidClassificatie.uri);

    return this.store.query('bestuursfunctie', {
      'filter[bevat-in][is-tijdsspecialisatie-van][bestuurseenheid][:id:]':this.bestuurseenheid.id
    });
  },

  setupController(controller, model) {
    this._super(controller, model);
    // Check if the clasificatie of the bestuurseenheid is not OCMW so we allow the use of this view
    if(this.bestuurseenheidClassificatie !== "http://data.vlaanderen.be/id/concept/BestuurseenheidClassificatieCode/5ab0e9b8a3b2ca7c5e000002") {
      controller.set('allowed', true);
    }
    controller.set('bestuurseenheid', this.bestuurseenheid);
  }
});
