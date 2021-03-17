import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default class SubsidyApplicationsIndexRoute extends Route.extend(DataTableRouteMixin) {
  modelName = 'application-form';

  mergeQueryOptions() {
    return {
      include: [
        'status',
        'subsidy-measure',
        'time-block',
        'last-modifier',
        'time-block.submission-period',
      ].join(',')
    };
  }
}
