/* eslint-disable ember/no-mixins */
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default class SubsidyApplicationsAvailableSubsidiesRoute extends Route.extend(DataTableRouteMixin) {
  @service currentSession;

  modelName = 'subsidy-measure-offer-series';

  // To mimic user testing as much as possible
  // we introduce testMode queryparam, which skips some of the (blocking) frontend business logic.
  // Note: Re-definition of the params specified by the mixin, since I didn't find a way to merge params from both sources.
  queryParams = {
    testMode: { refreshModel: true },
    filter: { refreshModel: true },
    page: { refreshModel: true },
    size: { refreshModel: true },
    sort: { refreshModel: true }
  };

  mergeQueryOptions(params) {
    const query = {
      include: [
        'period',
        'subsidy-measure-offer',
        // 'active-application-flow.first-application-step.subsidy-procedural-step.period' // This is so expensive to call
      ].join(',')
    };

    if(params.testMode){
      return query;
    }
    else {
      //Add extra rules to available subsidies
      const today = new Date();

      query['filter[active-application-flow][first-application-step][subsidy-procedural-step][period]'] = {
        ':lte:begin': today.toISOString(),
        ':gte:end': today.toISOString()
      };

      query[
        'filter[subsidy-measure-offer][criteria][requirement-groups][criterion-requirements][:exact:is-satisfiable-by]'
      ] = this.currentSession.groupClassification.uri;

      return query;
    }
  }
}
