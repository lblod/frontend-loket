import Component from '@glimmer/component';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { DECISION_TYPE } from 'frontend-loket/models/concept-scheme';
import { task, restartableTask, timeout } from 'ember-concurrency';
import { action } from '@ember/object';

export default class SupervisionSubmissionTypesSelect extends Component {
  @service store;

  @tracked besluitTypes = [];

  get selectedBesluitTypes() {
    const { besluitTypeIds } = this.args;
    if (besluitTypeIds && !this.isBesluitTypeLoading) {
      return this.besluitTypes.filter((type) =>
        besluitTypeIds.split(',').includes(type.id),
      );
    }

    return null;
  }

  get isBesluitTypeLoading() {
    return this.besluitTypes.length === 0;
  }

  constructor() {
    super(...arguments);
    this.loadData.perform();
  }

  @task
  *loadData() {
    this.besluitTypes = yield this.store.query('concept', {
      filter: {
        'concept-schemes': {
          ':uri:': DECISION_TYPE,
        },
      },
      sort: 'label',
      page: { size: 100 },
    });
    this.besluitTypes = this.besluitTypes.slice();
  }

  @restartableTask
  *searchBesluitType(term) {
    yield timeout(600);
    let results = yield this.store.query('concept', {
      filter: {
        label: term,
        'concept-schemes': {
          ':uri:': DECISION_TYPE,
        },
      },
      sort: 'label',
      page: { size: 100 },
    });

    return results.slice();
  }

  @action
  changeSelectedBesluitTypes(selectedTypes) {
    let besluitTypeIds = selectedTypes && selectedTypes.map((type) => type.id).join(',');
    this.args.onChange(besluitTypeIds);
  }
}
