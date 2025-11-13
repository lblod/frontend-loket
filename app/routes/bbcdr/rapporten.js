/* eslint-disable ember/no-mixins */
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DataTableRouteMixin from 'frontend-loket/mixins/ember-data-table/route';

export default class BbcdrRapportenRoute extends Route.extend(
  DataTableRouteMixin,
) {
  @service currentSession;
  @service store;

  modelName = 'bbcdr-report';

  mergeQueryOptions(params) {
    const bestuurseenheid = this.currentSession.group;
    return {
      sort: params.sort,
      filter: {
        bestuurseenheid: {
          id: bestuurseenheid.id,
        },
      },
      include: ['files', 'last-modifier', 'status'].join(','),
    };
  }
}
