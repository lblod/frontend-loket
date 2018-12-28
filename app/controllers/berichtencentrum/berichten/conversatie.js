import { inject } from '@ember/service';
import Controller from '@ember/controller';

export default Controller.extend({
  router: inject(),

  actions: {
    transitionToOverview(){
      this.router.transitionTo('berichtencentrum.berichten.index');
    }
  }
});
