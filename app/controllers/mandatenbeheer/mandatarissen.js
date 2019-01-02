import Controller from '@ember/controller';
import { task, timeout } from 'ember-concurrency';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import moment from 'moment';
import { sort } from '@ember/object/computed';

export default Controller.extend({
  router: service(),
  sort: 'is-bestuurlijke-alias-van.achternaam',
  page: 0,
  size: 20,
  hasActiveChildRoute: computed('router.currentRouteName', function() {
    return this.get('router.currentRouteName').startsWith('mandatenbeheer.mandatarissen.') &&
      this.get('router.currentRouteName') != 'mandatenbeheer.mandatarissen.index';
  }),

  bestuursorganenSortingDesc: Object.freeze(['bindingStart:desc']),
  descSortedBestuursorgaanWithBestuursperioden: sort('mandatenbeheer.bestuursorgaanWithBestuursperioden', 'bestuursorganenSortingDesc'),

  search: task(function*(searchData) {
    yield timeout(300);
    this.set('page', 0);
    yield this.set('filter', searchData);
  }).restartable(),

  selectedBestuursorgaan: computed('startDate', function() {
    if (this.mandatenbeheer.startDate) {
      return this.mandatenbeheer.bestuursorgaanWithBestuursperioden.find(
        o => o.bindingStart.toDateString() == new Date(this.mandatenbeheer.startDate).toDateString()
      );
    } else {
      return this.descSortedBestuursorgaanWithBestuursperioden.firstObject;
    }
  }),

  actions: {
    handleAddMandatarisClick() {
      if (this.get('router.currentRouteName') === 'mandatenbeheer.mandatarissen.new')
        this.transitionToRoute('mandatenbeheer.mandatarissen.index');
      else
        this.transitionToRoute('mandatenbeheer.mandatarissen.new');
    },

    select(selectedBestuursorgaan) {
      this.set('selectedBestuursorgaan', selectedBestuursorgaan);
      this.transitionToRoute('mandatenbeheer.mandatarissen', {
        queryParams: {
          page: 0,
          startDate: moment(selectedBestuursorgaan.bindingStart).format('YYYY-MM-DD')
        }
      });
    }
  }
});
