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
      worshipMinister.ministerPosition =
        this.store.createRecord('minister-position');
      worshipMinister.person = person;
      // worshipMinister.ministerPosition.function = {};
      // Don't know how to actually link a minister position function to a minister
      // worshipMinister.post.function = ministerPositionFunctions;
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
