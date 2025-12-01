/* eslint-disable ember/no-mixins */
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DataTableRouteMixin from 'frontend-loket/mixins/ember-data-table/route';

export default class SupervisionSubmissionsIndexRoute extends Route.extend(
  DataTableRouteMixin,
) {
  @service session;
  @service store;

  queryParams = {
    filter: { refreshModel: true },
    page: { refreshModel: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
    status: { refreshModel: true },
    besluitTypeIds: { refreshModel: true },
    sessionDateFrom: { refreshModel: true },
    sessionDateTo: { refreshModel: true },
  };

  modelName = 'submission';

  mergeQueryOptions(params) {
    const query = {
      include: ['form-data'].join(','),
    };

    if (params.status) {
      query['filter[status][:uri:]'] = params.status;
    } else {
      query['filter[status][id]'] = [
        '79a52da4-f491-4e2f-9374-89a13cde8ecd', // Concept status
        '9bd8d86d-bb10-4456-a84e-91e9507c374c', // Sent status
      ].join(',');
    }

    if (params.besluitTypeIds) {
      query['filter[form-data][decision-type][:id:]'] = params.besluitTypeIds;
    }

    if (params.sessionDateFrom)
      query['filter[form-data][:gte:session-started-at-time]'] =
        params.sessionDateFrom;

    if (params.sessionDateTo)
      query['filter[form-data][:lte:session-started-at-time]'] =
        params.sessionDateTo;

    return query;
  }
}
