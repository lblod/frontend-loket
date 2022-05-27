import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default class SectorSelect extends Component {
  @service store;

  constructor() {
    super(...arguments);

    this.loadSectors.perform();
  }

  @task
  *loadSectors() {
    // TODO: remove this once the sector concept uri is added
    return yield Promise.resolve([]);

    // let nextPage = 0;
    // let pageSize = 20;
    // let allSectors = [];

    // do {
    //   let sectorsOnPage = yield this.store.query('lpdc-concept', {
    //     'filter[in-scheme][:uri:]':
    //       'http://data.lblod.info/concept-schemes/id/2bc477b5-4f18-47ae-b627-476b73aef9f6', // TODO, replace this with the correct URI
    //     'page[size]': pageSize,
    //     'page[number]': nextPage,
    //   });

    //   allSectors = [...allSectors, ...sectorsOnPage.toArray()];

    //   nextPage = sectorsOnPage?.meta?.pagination?.next?.number;
    // } while (nextPage);

    // return allSectors;
  }
}
