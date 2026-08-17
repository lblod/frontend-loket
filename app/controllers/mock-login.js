import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { restartableTask, task, timeout } from 'ember-concurrency';

export default class MockLoginController extends Controller {
  @service store;

  queryParams = ['gemeente', 'page'];
  @tracked model;
  @tracked gemeente = '';
  @tracked page = 0;
  size = 10;

  queryStore = task(async () => {
    const filter = { provider: 'https://github.com/lblod/mock-login-service' };
    if (this.gemeente) {
      filter.gebruiker = { bestuurseenheden: this.gemeente };
    }
    const accounts = await this.store.query('account', {
      include: 'gebruiker,gebruiker.bestuurseenheden',
      filter: filter,
      page: { size: this.size, number: this.page },
      sort: 'gebruiker.achternaam',
    });
    return accounts;
  });

  updateSearch = restartableTask(async (value) => {
    await timeout(500);
    this.page = 0;
    this.gemeente = value;

    this.model = await this.queryStore.perform();
  });
}
