import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  router: service(),
  page: 0,
  size: 20,

  actions: {
    displayBestuursfunctie(bestuursfunctie) {
      this.router.transitionTo('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen', bestuursfunctie.id);
    }
  }
});
