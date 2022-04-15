import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default class BerichtencentrumBerichtenRoute extends Route.extend(
  DataTableRouteMixin
) {
  @service currentSession;
  @service store;

  modelName = 'conversatie';

  setupController(controller) {
    super.setupController(...arguments);
    controller.set('bestuurseenheid', this.currentSession.group);
  }
}
