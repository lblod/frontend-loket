import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class EredienstMandatenbeheerNewRoute extends Route {
  @service currentSession;
  @service store;

  queryParams = {
    personId: {
      refreshModel: true,
    },
  };

  beforeModel() {
    const mandatenbeheer = this.modelFor('eredienst-mandatenbeheer');
    this.bestuursorganen = mandatenbeheer.bestuursorganen;
  }

  async model({ personId }) {
    if (personId) {
      let [person, tijdsspecialisaties] = await Promise.all([
        this.store.findRecord('persoon', personId, {
          backgroundReload: false,
        }),
        this.bestuursorganen,
      ]);

      let worshipMandatee = this.store.createRecord('worship-mandatee');
      worshipMandatee.isBestuurlijkeAliasVan = person;

      return {
        worshipMandatee,
        person,
        bestuursorganen: tijdsspecialisaties,
      };
    }

    return {};
  }

  setupController(controller) {
    super.setupController(...arguments);
    controller.fetchBestuursorganenInTijd = this.fetchBestuursorganenInTijd;
  }

  resetController(controller, isExiting) {
    super.resetController(...arguments);

    if (isExiting) {
      controller.personId = '';
      controller.model?.worshipMandatee?.rollbackAttributes();
    }
  }

  async fetchBestuursorganenInTijd(mandaat) {
    let bestuursorganenInTijd = await this.store.query('bestuursorgaan', {
      'filter[bevat][:uri:]': mandaat.get('uri'),
      sort: '-binding-start',
    });
    return bestuursorganenInTijd;
  }
}
