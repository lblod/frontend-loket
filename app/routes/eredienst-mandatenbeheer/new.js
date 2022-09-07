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
    this.bestuursorganen =
      mandatenbeheer.bestuursorganen.sortBy('bindingStart');
  }

  async model({ personId }) {
    if (personId) {
      let [person, halfElectionList, tijdsspecialisaties] = await Promise.all([
        this.store.findRecord('persoon', personId, {
          backgroundReload: false,
        }),
        this.store.findAll('half-election'),
        this.bestuursorganen.length > 1
          ? [this.bestuursorganen.at(0)] // The recent bindingStart selected by default
          : this.bestuursorganen,
      ]);

      let worshipMandatee = this.store.createRecord('worship-mandatee');
      worshipMandatee.isBestuurlijkeAliasVan = person;

      return {
        worshipMandatee,
        person,
        halfElectionList,
        bestuursorganen: tijdsspecialisaties,
      };
    }

    return {};
  }

  resetController(controller, isExiting) {
    super.resetController(...arguments);

    if (isExiting) {
      controller.personId = '';
      controller.model?.worshipMandatee?.rollbackAttributes();
    }
  }
}
