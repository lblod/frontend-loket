import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Controller.extend({
  router: service(),
  page: 0,
  size: 20,
  hasActiveChildRoute: computed('router.currentRouteName', function() {
    return this.get('router.currentRouteName').startsWith('toezicht.inzendingen')
      && this.get('router.currentRouteName') != 'toezicht.inzendingen.index';
  }),
  actions: {
    handleAddClick() {
      if (this.get('router.currentRouteName') === 'toezicht.inzendingen.new')
        this.transitionToRoute('toezicht.inzendingen.index');
      else
        this.transitionToRoute('toezicht.inzendingen.new');
    }
  }
});
