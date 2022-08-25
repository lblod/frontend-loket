import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class WorshipMinisterManagementNewRoute extends Route {
  @service currentSession;
  @service store;

  queryParams = {
    personId: {
      refreshModel: true,
    },
  };

  async model({ personId }) {
    if (personId) {
      let [person, ministerPositionFunctions] = await Promise.all([
        this.store.findRecord('persoon', personId, {
          backgroundReload: false,
        }),
        this.store.findAll('minister-position-function'),
      ]);

      let worshipMinister = this.store.createRecord('minister');

      return {
        worshipMinister,
        ministerPositionFunctions,
        person,
      };
    }

    return {};
  }

  resetController(controller, isExiting) {
    super.resetController(...arguments);

    if (isExiting) {
      controller.personId = '';
      controller.model?.worshipMinister?.rollbackAttributes();
    }
  }
}
