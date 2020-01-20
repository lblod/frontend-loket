import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { task } from 'ember-concurrency';

export default Component.extend({
  tagName: '',

  store: service(),

  didReceiveAttrs() {
    this._super(...arguments);
    this.initTable.perform();
  },

  initTable: task(function * () {
    const sexes = yield this.store.query('geslacht-code', {
      page: { size: 10 },
      sort: 'label',
      'filter[id]': '5ab0e9b8a3b2ca7c5e000029,5ab0e9b8a3b2ca7c5e000028' // vrouwelijk, mannelijk
    });
    const workingTimeCategories = yield this.store.query('working-time-category', { page: { size: 10 }, sort: '-label' });
    const legalStatuses = yield this.store.query('employee-legal-status', { page: { size: 10 }, sort: '-label' });
    const educationalLevels = yield this.store.query('educational-level', { page: { size: 10 }, sort: 'label' });

    this.set('sexes', sexes);
    this.set('workingTimeCategories', workingTimeCategories);
    this.set('legalStatuses', legalStatuses);
    this.set('educationalLevels', educationalLevels);

    const unitMeasure = (this.observations.firstObject || {}).unitMeasure;
    this.set('unitMeasure', unitMeasure);
  }).keepLatest(),

  total: computed('observations.@each.value', function() {
    return (this.observations || []).reduce((acc, obs) => {
      return acc + parseFloat(obs.value || 0);
    }, 0);
  })
});
