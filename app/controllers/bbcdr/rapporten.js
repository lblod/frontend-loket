import { computed } from '@ember/object';
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  router: service(),
  sort: '-modified',
  page: 0,
  size: 20,
  hasActiveChildRoute: computed('router.currentRouteName', function() {
    return this.get('router.currentRouteName').startsWith('bbcdr.rapporten.')
      && this.get('router.currentRouteName') != 'bbcdr.rapporten.index';
  })
});
