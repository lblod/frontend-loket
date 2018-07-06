import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  currentSession: service(),

  model(){
    return this.get('currentSession.group');
  },

  async afterModel(model) {
    await model.get('classificatie');
  }
});
