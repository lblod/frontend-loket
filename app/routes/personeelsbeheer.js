import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  currentSession: service(),
  session: service(),

  beforeModel() {
    if (!this.currentSession.canAccessPersoneelsbeheer)
      this.transitionTo('index');
  },

  model() {
    return this.currentSession.group; // bestuurseenheid
  }

});
