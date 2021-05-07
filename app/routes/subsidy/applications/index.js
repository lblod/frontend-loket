/* eslint-disable ember/no-mixins */
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DataTableRouteMixin from 'ember-data-table/mixins/route';
import { ROLES } from 'frontend-loket/models/participation';

export default class SubsidyApplicationsIndexRoute extends Route.extend(DataTableRouteMixin) {
  @service('current-session') currentSession;
  modelName = 'subsidy-measure-consumption';

  mergeQueryOptions() {
    let groupId = this.currentSession.groupContent.id;
    return {
      include: [
        'status',
        'subsidy-measure-offer',
        'subsidy-application-flow.subsidy-measure-offer-series.period',
        'active-subsidy-application-flow-step.subsidy-procedural-step.period',
        'participations',
        'last-modifier',
      ].join(','),
      filter: {
        participations: {
           "participating-bestuurseenheid": {
             "id": groupId,
           },
          ":exact:role": ROLES.APPLICANT
        }
      }
    };
  }
}
