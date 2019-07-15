import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Controller.extend({
  router: service(),
  page: 0,
  size: 20,
  sort: 'status.label,-sent-date',

  actions: {
    handleAddClick() {
      if (this.get('router.currentRouteName') === 'toezicht.inzendingen.new')
        this.transitionToRoute('toezicht.inzendingen.index');
      else
        this.transitionToRoute('toezicht.inzendingen.new');
    }
  }
});
