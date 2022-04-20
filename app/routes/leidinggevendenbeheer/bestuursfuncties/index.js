import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class LeidinggevendenbeheerBestuursfunctiesIndexRoute extends Route {
  @service currentSession;
  @service store;

  async model(params, transition) {
    let bestuurseenheid = this.modelFor('leidinggevendenbeheer');
    transition.data.bestuurseenheid = bestuurseenheid;

    return this.store.query('bestuursfunctie', {
      'filter[bevat-in][is-tijdsspecialisatie-van][bestuurseenheid][:id:]':
        bestuurseenheid.id,
    });
  }

  setupController(controller, model, transition) {
    super.setupController(...arguments);

    const bestuurseenheidClassificatie =
      this.currentSession.groupClassification;

    if (
      bestuurseenheidClassificatie.uri !==
      'http://data.vlaanderen.be/id/concept/BestuurseenheidClassificatieCode/5ab0e9b8a3b2ca7c5e000002'
    ) {
      controller.allowed = true;
    }

    controller.bestuurseenheid = transition.data.bestuurseenheid;
  }
}
