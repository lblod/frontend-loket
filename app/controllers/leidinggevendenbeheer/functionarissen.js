import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Controller.extend({
  router: service(),
  sort: 'start',
  page: 0,
  size: 20,
  hasActiveChildRoute: computed('router.currentRouteName', function() {
    return this.get('router.currentRouteName').startsWith('leidinggevendenbeheer.functionarissen.') &&
      this.get('router.currentRouteName') != 'leidinggevendenbeheer.functionarissen.index';
  }),

  actions: {
    handleVoegNieuweAanstellingsperiodeClick(){
      this.router.transitionTo('leidinggevendenbeheer.functionarissen.new.select-persoon');
    }
  }
});