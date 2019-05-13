import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  currentSession: service(),

  async beforeModel() {
    const bestuurseenheid = await this.get('currentSession.group');
    this.set('bestuurseenheid', bestuurseenheid);
  },

  async model(params){
    const bestuursfunctie = await this.store.findRecord('bestuursfunctie', params.id);
    return {
      functionarissen: await this.store.query('functionaris', {'filter[bekleedt][id]': params.id}),
      bestuursfunctie: bestuursfunctie
    }
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('bestuurseenheid', this.bestuurseenheid);
  }
});