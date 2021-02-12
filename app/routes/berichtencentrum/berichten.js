import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';
import { inject as service } from '@ember/service';

export default class BerichtencentrumBerichtenRoute extends Route.extend(DataTableRouteMixin) {

  @service() currentSession;

  modelName = 'conversatie';

  async beforeModel() {
    const bestuurseenheid = await this.currentSession.group;
    this.set('bestuurseenheid', bestuurseenheid);
  }

  setupController( controller, model ) {
    super.setupController(...arguments);
    controller.set('bestuurseenheid', this.bestuurseenheid);
  }
}
