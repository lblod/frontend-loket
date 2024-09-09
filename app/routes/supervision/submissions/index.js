/* eslint-disable ember/no-mixins */
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

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
  };

  modelName = 'submission';

  mergeQueryOptions({ status }) {
    const query = {
      include: ['form-data'].join(','),
    };

    if (status) {
      query['filter[status][:uri:]'] = status;
    } else {
      query['filter[status][id]'] = [
        '79a52da4-f491-4e2f-9374-89a13cde8ecd', // Concept status
        '9bd8d86d-bb10-4456-a84e-91e9507c374c', // Sent status
      ].join(',');
    }

    return query;
  }
}
