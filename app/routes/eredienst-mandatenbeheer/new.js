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

  async model({ personId }) {
    if (personId) {
      let [person, halfElectionList, tijdsspecialisaties] = await Promise.all([
        this.store.findRecord('persoon', personId, {
          backgroundReload: false,
        }),
        this.store.findAll('half-election'),
        this.store.query('bestuursorgaan', {
          'filter[is-tijdsspecialisatie-van][bestuurseenheid][:id:]':
            this.currentSession.group.id,
          'filter[binding-start]': '1971-11-03',
        }),
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
