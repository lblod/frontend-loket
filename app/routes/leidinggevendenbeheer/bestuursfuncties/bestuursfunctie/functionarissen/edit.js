import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  model(params) {
    return this.store.findRecord('functionaris', params.functionaris_id);
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('initialStatus', model.status);
  }
});
