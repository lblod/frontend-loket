import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class MockLoginRoute extends Route {
  @service() session;
  @service() store;

  queryParams = {
    page: {
      refreshModel: true
    }
  }

  beforeModel() {
    if (this.session.isAuthenticated)
      this.transitionTo('index');
  }
  
  model(params) {
    const filter = { provider: 'https://github.com/lblod/mock-login-service' };
    if (params.gemeente)
      filter.gebruiker = { 'bestuurseenheden': params.gemeente };
    return this.store.query('account', {
      include: 'gebruiker.bestuurseenheden',
      filter: filter,
      page: { size: 10, number: params.page },
      sort: 'gebruiker.achternaam'
    });
  }
}

