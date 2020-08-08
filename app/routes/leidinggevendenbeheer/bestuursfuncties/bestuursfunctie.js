import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  currentSession: service('current-session'),

  async afterModel(){
    const bestuurseenheidClassificatie = await (await this.currentSession.group).classificatie;
    if(bestuurseenheidClassificatie.uri === "http://data.vlaanderen.be/id/concept/BestuurseenheidClassificatieCode/5ab0e9b8a3b2ca7c5e000002") {
      this.transitionTo('leidinggevendenbeheer.bestuursfuncties.index');
    }
  },

  model(params) {
    return this.store.findRecord('bestuursfunctie', params.bestuursfunctie_id);
  }
});
