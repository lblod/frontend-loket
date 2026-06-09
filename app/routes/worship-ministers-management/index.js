/* eslint-disable ember/no-mixins */
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DataTableRouteMixin from 'frontend-loket/mixins/ember-data-table/route';
import {
  NO_PROVENANCE_VENDOR_ID,
  ALL_VENDORS_ID,
} from 'frontend-loket/models/vendor';

export default class WorshipMinistersManagementIndexRoute extends Route.extend(
  DataTableRouteMixin,
) {
  @service currentSession;
  @service router;
  @service store;

  queryParams = {
    filter: { refreshModel: true },
    page: { refreshModel: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
    vendorId: { refreshModel: true },
  };

  modelName = 'minister';
  hasInitializedVendorDefault = false;

  beforeModel(transition) {
    const qps = transition.to.queryParams;
    if (!this.hasInitializedVendorDefault) {
      this.hasInitializedVendorDefault = true;

      if (!qps.vendorId) {
        // We're just taking the first vendor we receive as the default for now.
        const defaultVendor = this.currentSession.vendors.at(0);

        if (defaultVendor) {
          this.router.transitionTo({
            queryParams: { vendorId: defaultVendor.id },
          });
        }
      }
    }
  }

  mergeQueryOptions(params) {
    const queryParams = {
      include: ['person', 'minister-position.function', 'provenance'].join(','),
      filter: {},
    };

    if (params.vendorId === NO_PROVENANCE_VENDOR_ID) {
      queryParams['filter'][':has-no:provenance'] = true;
    } else if (params.vendorId && params.vendorId !== ALL_VENDORS_ID) {
      queryParams['filter']['provenance'] = { id: params.vendorId };
    }

    return queryParams;
  }
}
