import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default class BbcdrRapportenRoute extends Route.extend(
  DataTableRouteMixin
) {
  @service currentSession;
  @service store;

  modelName = 'bbcdr-report';

  async beforeModel() {
    const bestuurseenheid = this.currentSession.group;
    this.set('bestuurseenheid', bestuurseenheid);
  }

  mergeQueryOptions(params) {
    return {
      sort: params.sort,
      filter: {
        bestuurseenheid: {
          id: this.bestuurseenheid.id,
        },
      },
      include: ['files', 'last-modifier', 'status'].join(','),
    };
  }

  setupController(controller) {
    super.setupController(...arguments);
    controller.set('bestuurseenheid', this.bestuurseenheid);
  }
}
