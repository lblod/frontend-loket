import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class WorshipMinistersManagementMinisterDetailsRoute extends Route {
  @service store;

  async model() {
    let { worshipMinisterId } = this.paramsFor(
      'worship-ministers-management.minister'
    );

    const minister = await this.store.findRecord(
      'minister',
      worshipMinisterId,
      {
        include: ['person', 'contacts', 'minister-position.function'].join(),
      }
    );

    return minister;
  }
}
