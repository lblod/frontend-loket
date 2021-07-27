import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class LeidinggevendenbeheerBestuursfunctiesBestuursfunctieRoute extends Route {
  @service('current-session') currentSession;

  async afterModel(){
    const bestuurseenheidClassificatie = this.currentSession.groupClassification;
    if(bestuurseenheidClassificatie.uri === "http://data.vlaanderen.be/id/concept/BestuurseenheidClassificatieCode/5ab0e9b8a3b2ca7c5e000002") {
      this.transitionTo('leidinggevendenbeheer.bestuursfuncties.index');
    }
  }

  model(params) {
    return this.store.findRecord('bestuursfunctie', params.bestuursfunctie_id);
  }
}
