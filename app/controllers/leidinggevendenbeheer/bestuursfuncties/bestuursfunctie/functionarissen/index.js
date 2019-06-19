import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  router: service(),
  sort: 'start',
  page: 0,
  size: 20,

  actions: {
    handleVoegNieuweAanstellingsperiodeClick() {
      this.router.transitionTo('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen.new.select-persoon');
    }
  }
});