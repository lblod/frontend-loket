import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { CLASSIFICATION_CODE } from '../models/administrative-unit-classification-code';
import { trackedTask } from 'ember-resources/util/ember-concurrency';
import { tracked } from '@glimmer/tracking';

export default class ProvinceSelectComponent extends Component {
  @service store;

  @tracked previousMunicipality;
  @tracked previousProvince;

  provinces = trackedTask(this, this.loadProvincesTask, () => [
    this.args.selectedMunicipality,
  ]);

  @task
  *loadProvincesTask() {
    // Trick used to avoid infinite loop
    // See https://github.com/NullVoxPopuli/ember-resources/issues/340 for more details
    yield Promise.resolve();

    let provinces = [];
    if (
      this.args.selectedMunicipality &&
      this.args.selectedMunicipality.length
    ) {
      if (
        this.previousMunicipality &&
        this.args.selectedMunicipality === this.previousMunicipality
      ) {
        this.args.onChange(this.previousProvince);

        this.provinces.cancel(); //  prevent infinite loop.
        return [this.previousProvince];
      }

      // If a municipality is selected, load the province it belongs to
      provinces = yield this.store.query('administrative-unit', {
        filter: {
          'sub-organizations': {
            ':exact:name': this.args.selectedMunicipality,
          },
          classification: {
            id: CLASSIFICATION_CODE.PROVINCE,
          },
        },
      });
    } else {
      // Else load all the provinces
      const query = {
        filter: {
          classification: {
            id: CLASSIFICATION_CODE.PROVINCE,
          },
        },
        sort: 'name',
      };
      provinces = yield this.store.query('administrative-unit', query);
    }

    if (provinces.toArray().length === 1) {
      this.previousMunicipality = this.args.selectedMunicipality;
      this.previousProvince = provinces.mapBy('name').toArray()[0];
      this.args.onChange(this.previousProvince);
    } else {
      this.previousMunicipality = null;
      this.previousProvince = null;
    }
    return provinces.mapBy('name');
  }
}
