import { get } from '@ember/object';
import Component from '@ember/component';
import { task, all } from 'ember-concurrency';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),

  didReceiveAttrs() {
    this._super(...arguments);
    if (this.dataset)
      this.calculateTotals.perform();
  },

  calculateTotals: task(function * () {
    const periods = yield this.store.query('employee-period-slice', {
      page: { size: 1 },
      sort: '-time-period.start',
      'filter[dataset][id]': this.dataset.id
    });
    const latestPeriod = periods.firstObject;

    if (latestPeriod) {
      const workingTimeCategories = yield this.store.findAll('working-time-category');

      const summary = yield all(workingTimeCategories.map(async (category) => {
        const observations = await this.store.query('employee-observation', {
          page: { size: 1000 },
          'filter[slice][id]': latestPeriod.id,
          'filter[working-time-category][id]': category.id
        });
        let total = observations.reduce((acc, obs) => { return acc + parseFloat(obs.value || 0); }, 0);

        let datasetSubjects = await get( this, "dataset.subjects" );

        const isFloat = get( datasetSubjects, "firstObject" ) ? get( datasetSubjects, "firstObject.isFTE" ) : false;

        if( isFloat )
          total = total.toFixed(2);
        else
          total = parseInt( total );

        return { label: category.label, total };
      }));

      this.set('summary', summary);
    } else {
      this.set('summary', []);
    }
  }).keepLatest()
});
