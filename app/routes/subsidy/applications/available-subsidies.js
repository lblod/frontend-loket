/* eslint-disable ember/no-mixins */
import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default class SubsidyApplicationsAvailableSubsidiesRoute extends Route.extend(DataTableRouteMixin) {
  modelName = 'subsidy-measure-offer-series';

  mergeQueryOptions() {
    return {
      include: [
        'period',
        'subsidy-measure-offer'
      ].join(','),
      'filter[period][:gte:end]': new Date().toISOString()
    };
  }
}
