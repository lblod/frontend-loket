import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  currentSession: service(),

  async model() {
    return this.store.query('bestuursfunctie', {
      'filter[bevat-in][is-tijdsspecialisatie-van][bestuurseenheid][:id:]':this.bestuurseenheid.id
    });
  },

  async beforeModel() {
    const bestuurseenheid = await this.get('currentSession.group');
    this.set('bestuurseenheid', bestuurseenheid);
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('bestuurseenheid', this.bestuurseenheid);
  }
});
