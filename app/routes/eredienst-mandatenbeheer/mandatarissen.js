import Route from '@ember/routing/route';
// eslint-disable-next-line ember/no-mixins
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default class EredienstMandatenbeheerMandatarissenRoute extends Route.extend(
  DataTableRouteMixin
) {
  modelName = 'worship-mandatee';

  mergeQueryOptions() {
    return {
      include: ['type-half', 'bekleedt'].join(','),
    };
  }
}
