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
      let [person, ministerPositions] = await Promise.all([
        this.store.findRecord('persoon', personId, {
          backgroundReload: false,
        }),
        this.store.query('minister-position', {
          'filter[worship-service][:uri:]': this.currentSession.group.uri,
          include: 'function',
        }),
      ]);

      let worshipMinister = this.store.createRecord('minister');
      worshipMinister.person = person;

      return {
        worshipMinister,
        ministerPositions,
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
