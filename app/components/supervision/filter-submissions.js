import Component from '@glimmer/component';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';
import InzendingenFilter from 'frontend-loket/utils/inzendingen-filter';
import { typeOf } from '@ember/utils';

export default class SupervisionFilterSubmissions extends Component {
  @service store;

  @tracked besluitTypes = [];
  @tracked selectedBesluitTypes = null;
  @tracked filter;

  constructor() {
    super(...arguments);
    this.filter = new InzendingenFilter(this.args.filter);
    this.loadData.perform();
  }

  @task
  *loadData() {
    this.besluitTypes = yield this.store.query('concept', {
      filter: {
        'concept-schemes': {
          ':uri:': 'http://lblod.data.gift/concept-schemes/71e6455e-1204-46a6-abf4-87319f58eaa5',
        },
      },
      sort: 'label',
      page: { size: 100 },
    });
    this.besluitTypes = this.besluitTypes.slice();

    this.updateSelectedValue();
  }

  get isLoading() {
    return this.besluitTypes.length === 0;
  }

  get selectedBesluitTypesNull() {
    const { besluitTypeUri } = this.args;
    if (besluitTypeUri && !this.isLoading) {
      return this.besluitTypes.find((besluitType) => besluitType.uri === besluitTypeUri);
    }

    return null;
  }

  @action
  async updateSelectedValue() {
    if (this.filter.besluitTypeIds && !this.selectedBesluitTypes) {
      let selected = await this.store.query('concept', {
        filter: {
          id: this.filter.besluitTypeIds,
          'concept-schemes': {
            ':uri:': 'http://lblod.data.gift/concept-schemes/71e6455e-1204-46a6-abf4-87319f58eaa5',
          },
        },
        page: { size: this.filter.besluitTypeIds.split(',').length },
      });
      this.selectedBesluitTypes = selected.slice();
    } else if (!this.filter.besluitTypeIds) {
      this.selectedBesluitTypes = null;
    }
  }

  @action
  setFilter(key, value) {
    if (typeOf(value) == 'array') this.filter[key] = value.join(',');
    else this.filter[key] = value;
    this.args.onFilterChange(this.filter);
  }

  @action
  changeSelectedBesluitTypes(selectedTypes) {
    this.selectedBesluitTypes = selectedTypes;
    this.filter.besluitTypeIds = selectedTypes && selectedTypes.map((type) => type.id).join(',');

    this.args.onFilterChange(this.filter);
  }
}
