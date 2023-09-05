import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { restartableTask, timeout } from 'ember-concurrency';

export default class CountrySelectComponent extends Component {
  @service store;

  @restartableTask
  *searchCountriesTask(search = '') {
    yield timeout(500);

    const query = {
      sort: 'country-label',
    };

    if (search.trim() !== '') {
      query['filter[country-label]'] = search;
    }

    const nationalitues = yield this.store.query('nationality', query);
    return nationalitues.map((n) => n.countryLabel);
  }
}
