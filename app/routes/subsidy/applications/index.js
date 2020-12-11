import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default class SubsidyApplicationsIndexRoute extends Route.extend(AuthenticatedRouteMixin, DataTableRouteMixin) {
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
