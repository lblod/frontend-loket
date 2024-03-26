import Controller from '@ember/controller';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { restartableTask, task, timeout } from 'ember-concurrency';

export default class ImpersonateController extends Controller {
  @service impersonation;
  @service router;
  @service store;

  queryParams = ['gemeente', 'page'];
  @tracked model;
  @tracked gemeente = '';
  @tracked page = 0;
  size = 10;

  setup() {
    this.queryStore.perform();
  }

  @task
  *queryStore() {
    const filter = { provider: 'https://github.com/lblod/mock-login-service' };
    if (this.gemeente) {
      filter.gebruiker = { bestuurseenheden: this.gemeente };
    }
    const accounts = yield this.store.query('account', {
      include: 'gebruiker,gebruiker.bestuurseenheden',
      filter: filter,
      page: { size: this.size, number: this.page },
      sort: 'gebruiker.achternaam',
    });

    this.model = accounts;
  }

  @restartableTask
  *updateSearch(event) {
    yield timeout(500);
    this.page = 0;
    this.gemeente = event.target.value;

    yield this.queryStore.perform();
  }

  impersonateAccount = task(async (accountId) => {
    // TODO; check if an impersonation was already active, we probably need to clear things first then, or refresh the app afterwards to delete the in-memory data.
    await this.impersonation.impersonate(accountId);
    this.router.transitionTo('index');
  });
}
