import Component from '@glimmer/component';
import { service } from '@ember/service';
import { restartableTask, timeout } from 'ember-concurrency';

export default class SharedPersoonNationalitySelectorComponent extends Component {
  @service store;

  searchNationalitiesTask = restartableTask(async (search = '') => {
    await timeout(500);

    const query = {
      sort: 'nationality-label',
    };

    if (search.trim() !== '') {
      query['filter[nationality-label]'] = search;
      return await this.store.query('nationality', query);
    }

    return [];
  });
}
