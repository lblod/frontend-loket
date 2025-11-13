/* eslint-disable ember/no-mixins */
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DataTableRouteMixin from 'frontend-loket/mixins/ember-data-table/route';

export default class BerichtencentrumBerichtenRoute extends Route.extend(
  DataTableRouteMixin,
) {
  @service currentSession;
  @service store;

  modelName = 'conversatie';
  mergeQueryOptions() {
    return {
      include: 'laatste-bericht.van',
    };
  }

  setupController(controller) {
    super.setupController(...arguments);
    controller.set('bestuurseenheid', this.currentSession.group);
  }
}
