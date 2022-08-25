/* eslint-disable ember/no-mixins */
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default class WorshipMinistersManagementIndexRoute extends Route.extend(
  DataTableRouteMixin
) {
  @service store;

  modelName = 'minister';

  mergeQueryOptions() {
    const queryParams = {
      include: ['person', 'minister-position.function'].join(','),
    };

    return queryParams;
  }
}
