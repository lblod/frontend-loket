import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { keepLatestTask } from 'ember-concurrency';

export default class EmployeePeriodSliceTable extends Component {
  @service store;

  constructor() {
    super(...arguments);
    const { observations } = this.args;
    this.observations = observations;
    this.isFTEDataset = observations.firstObject.unitMeasure.get('isFTE');
    if (observations) this.initTable.perform();
  }

  @keepLatestTask *initTable() {
    const sexes = yield this.store.query('geslacht-code', {
      page: { size: 10 },
      sort: 'label',
      'filter[id]': '5ab0e9b8a3b2ca7c5e000029,5ab0e9b8a3b2ca7c5e000028', // vrouwelijk, mannelijk
    });
    const workingTimeCategories = yield this.store.query(
      'working-time-category',
      { page: { size: 10 }, sort: '-label' }
    );
    const legalStatuses = yield this.store.query('employee-legal-status', {
      page: { size: 10 },
      sort: '-label',
    });
    const educationalLevels = yield this.store.query('educational-level', {
      page: { size: 10 },
      sort: 'label',
    });

    this.sexes = sexes;
    this.workingTimeCategories = workingTimeCategories;
    this.legalStatuses = legalStatuses;
    this.educationalLevels = educationalLevels;

    const unitMeasure = (this.observations.firstObject || {}).unitMeasure;
    this.unitMeasure = unitMeasure;
  }

  get total() {
    const totalValue = (this.observations || []).reduce((acc, obs) => {
      return acc + parseFloat(obs.value || 0);
    }, 0);

    if (this.isFTEDataset) return totalValue.toFixed(2);
    else return parseInt(totalValue);
  }
}
