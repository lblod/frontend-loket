import { computed } from '@ember/object';
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  router: service(),
  sort: 'status.label', //TODO: someday we should have a hierarchy!
  page: 0,
  size: 20,
  hasActiveChildRoute: computed('router.currentRouteName', function() {
    return this.get('router.currentRouteName').startsWith('bbcdr.rapporten.')
      && this.get('router.currentRouteName') != 'bbcdr.rapporten.index';
  }),
  actions: {
    createNewReport() {
      if (this.get('router.currentRouteName') == 'bbcdr.rapporten.new')
        this.transitionToRoute('bbcdr.rapporten.index');
      else
        this.transitionToRoute('bbcdr.rapporten.new');
    }
  }
});
