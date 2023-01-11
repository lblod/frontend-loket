/* eslint-disable ember/no-mixins */
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default class WorshipMinistersManagementIndexRoute extends Route.extend(
  DataTableRouteMixin
) {
  @service store;

  modelName = 'minister';

  async beforeModel() {
    this.bestuurseenheid = await this.modelFor('worship-ministers-management');
  }

  mergeQueryOptions() {
    const queryParams = {
      include: ['person', 'minister-position.function'].join(','),
    };

    return queryParams;
  }

  setupController(controller) {
    super.setupController(...arguments);
    controller.bestuurseenheid = this.bestuurseenheid;
  }
}
