import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  currentSession: service(),

  beforeModel() {
    if (!this.currentSession.canAccessLeidinggevenden)
      this.transitionTo('index');
  }
  
});
