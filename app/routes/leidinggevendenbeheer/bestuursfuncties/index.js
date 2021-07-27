import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class LeidinggevendenbeheerBestuursfunctiesIndexRoute extends Route {
  @service('current-session') currentSession;

  async model() {
    this.set('bestuurseenheid', this.modelFor('leidinggevendenbeheer'));
    const bestuurseenheidClassificatie = this.currentSession.groupClassification;
    this.set('bestuurseenheidClassificatie', bestuurseenheidClassificatie.uri);

    return this.store.query('bestuursfunctie', {
      'filter[bevat-in][is-tijdsspecialisatie-van][bestuurseenheid][:id:]':this.bestuurseenheid.id
    });
  }

  setupController( controller, model ) {
    super.setupController(...arguments);
    if(this.bestuurseenheidClassificatie !== "http://data.vlaanderen.be/id/concept/BestuurseenheidClassificatieCode/5ab0e9b8a3b2ca7c5e000002") {
      controller.set('allowed', true);
    }
    controller.set('bestuurseenheid', this.bestuurseenheid);
  }
}
