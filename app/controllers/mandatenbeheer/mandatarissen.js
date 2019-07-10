import Controller from '@ember/controller';
import { task, timeout } from 'ember-concurrency';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { sort, alias } from '@ember/object/computed';

export default Controller.extend({
  router: service(),
  sort: 'is-bestuurlijke-alias-van.achternaam',
  page: 0,
  size: 20,
  hasActiveChildRoute: computed('router.currentRouteName', function() {
    return this.get('router.currentRouteName').startsWith('mandatenbeheer.mandatarissen.') &&
      this.get('router.currentRouteName') != 'mandatenbeheer.mandatarissen.index';
  }),

  startDate: alias('mandatenbeheer.startDate'),
  bestuursperioden: alias('mandatenbeheer.bestuursperioden'),
  bestuurseenheid: alias('mandatenbeheer.bestuurseenheid'),
  bestuursorganen: alias('mandatenbeheer.bestuursorganen'),

  search: task(function*(searchData) {
    yield timeout(300);
    this.set('page', 0);
    this.set('filter', searchData);
  }).restartable(),

  actions: {
    handleAddMandatarisClick() {
      if (this.get('router.currentRouteName') === 'mandatenbeheer.mandatarissen.new')
        this.transitionToRoute('mandatenbeheer.mandatarissen.index');
      else
        this.transitionToRoute('mandatenbeheer.mandatarissen.new');
    },

    handleBeheerFractiesClick() {
      this.router.transitionTo('mandatenbeheer.fracties');
    },

    selectPeriod(startDate) {
      this.transitionToRoute('mandatenbeheer.mandatarissen', {
        queryParams: {
          page: 0,
          startDate: startDate
        }
      });
    }
  }
});
