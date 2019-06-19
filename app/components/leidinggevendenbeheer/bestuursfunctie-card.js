import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  router: service(),
  model: null,

  actions: {
    handleEditAanstellingsperiodesClick() {
      this.router.transitionTo('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen', this.model.id);
    }
  }
});