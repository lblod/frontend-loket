import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Controller.extend({
  router: service(),

  page: 0,
  size: 20,

  hasActiveChildRoute: computed('router.currentRouteName', function() {
    return this.get('router.currentRouteName').startsWith('leidinggevendenbeheer.bestuursfuncties.')
        && this.get('router.currentRouteName') != 'leidinggevendenbeheer.bestuursfuncties.index';
  })
});