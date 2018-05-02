import Controller from '@ember/controller';
import { task, timeout } from 'ember-concurrency';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend({
  router: service(),
  sort: 'is-bestuurlijke-alias-van.achternaam',
  page: 0,
  size: 20,
  hasActiveChildRoute: computed('router.currentRouteName', function() {
    return this.get('router.currentRouteName').startsWith('mandatenbeheer.mandatarissen.')
      && this.get('router.currentRouteName') != 'mandatenbeheer.mandatarissen.index';
  }),

  search: task(function* (searchData) {
   yield timeout(300);
   yield this.set('filter', searchData);
  }).restartable(),

  actions: {
    handleAddMandatarisClick() {
      if (this.get('router.currentRouteName') === 'mandatenbeheer.mandatarissen.new')
        this.transitionToRoute('mandatenbeheer.mandatarissen.index');
      else
        this.transitionToRoute('mandatenbeheer.mandatarissen.new');
    }
  }
});
