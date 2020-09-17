import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default class SupervisionSubmissionsIndexRoute extends Route.extend(AuthenticatedRouteMixin, DataTableRouteMixin) {
  modelName = 'submission'
  mergeQueryOptions() {
    return {
      include: [
        'status',
        'creator',
        'task',
        'last-modifier',
        'form-data.passed-by',
        'form-data.passed-by.is-tijdsspecialisatie-van',
        'form-data.decision-type',
        'form-data.regulation-type'
      ].join(','),
      'filter[status][id]': [
        '79a52da4-f491-4e2f-9374-89a13cde8ecd',  // Concept status
        '9bd8d86d-bb10-4456-a84e-91e9507c374c'   // Sent status
      ].join(',')
    };
  }
}
