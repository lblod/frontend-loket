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
      let person = await this.store.findRecord('persoon', personId, {
        backgroundReload: false,
      });
      // let [person, post] = await Promise.all([
      //   this.store.findRecord('persoon', personId, {
      //     backgroundReload: false,
      //   }),
      //   this.store.findAll('minister-position'),
      // ]);

      let worshipMinister = this.store.createRecord('minister');
      let ministerPosition = this.store.createRecord('minister-position');
      let ministerPositionFunction = this.store.createRecord(
        'minister-position-function'
      );
      worshipMinister.person = person;
      worshipMinister.post = ministerPosition;
      worshipMinister.post.function = ministerPositionFunction;

      console.log('worship minister', worshipMinister);

      return {
        worshipMinister,
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
