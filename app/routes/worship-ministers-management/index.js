/* eslint-disable ember/no-mixins */
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DataTableRouteMixin from 'frontend-loket/mixins/ember-data-table/route';
import { NO_PROVENANCE_VENDOR_ID } from 'frontend-loket/routes/eredienst-mandatenbeheer/mandatarissen';

export default class WorshipMinistersManagementIndexRoute extends Route.extend(
  DataTableRouteMixin,
) {
  @service store;

  queryParams = {
    filter: { refreshModel: true },
    page: { refreshModel: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
    vendorId: { refreshModel: true },
  };

  modelName = 'minister';

  mergeQueryOptions(params) {
    const queryParams = {
      include: ['person', 'minister-position.function', 'provenance'].join(','),
      filter: {},
    };

    if (params.vendorId === NO_PROVENANCE_VENDOR_ID) {
      queryParams['filter'][':has-no:provenance'] = true;
    } else if (params.vendorId) {
      queryParams['filter']['provenance'] = { id: params.vendorId };
    }

    return queryParams;
  }
}
