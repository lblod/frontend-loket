import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { restartableTask, timeout } from 'ember-concurrency';

export default class SharedPersoonNationalitySelectorComponent extends Component {
  @service store;

  @restartableTask
  *searchNationalitiesTask(search = '') {
    yield timeout(500);

    const query = {
      sort: 'nationality-label',
    };

    if (search.trim() !== '') {
      query['filter[nationality-label]'] = search;
    }

    return yield this.store.query('nationality', query);
  }
}
