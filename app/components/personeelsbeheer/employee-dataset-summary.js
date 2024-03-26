import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { all, keepLatestTask } from 'ember-concurrency';
import { inject as service } from '@ember/service';

export default class EmployeeDatasetSummary extends Component {
  @service store;

  @tracked summary;

  constructor() {
    super(...arguments);
    if (this.args.dataset) this.calculateTotals.perform();
  }

  @keepLatestTask *calculateTotals() {
    const periods = yield this.store.query('employee-period-slice', {
      page: { size: 1 },
      sort: '-time-period.start',
      'filter[dataset][id]': this.args.dataset.id,
    });
    const latestPeriod = periods.at(0);

    if (latestPeriod) {
      const workingTimeCategories = yield this.store.findAll(
        'working-time-category',
      );

      const summary = yield all(
        workingTimeCategories.map(async (category) => {
          const observations = await this.store.query('employee-observation', {
            page: { size: 1000 },
            'filter[slice][id]': latestPeriod.id,
            'filter[working-time-category][id]': category.id,
          });
          let total = observations.reduce((acc, obs) => {
            return acc + parseFloat(obs.value || 0);
          }, 0);

          let datasetSubjects = await this.args.dataset.subjects;

          const isFloat = datasetSubjects.at(0)
            ? datasetSubjects.at(0).isFTE
            : false;

          if (isFloat) total = total.toFixed(2);
          else total = parseInt(total);

          return { label: category.label, total };
        }),
      );

      this.summary = summary;
    } else {
      this.summary = [];
    }
  }
}
