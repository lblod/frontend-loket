import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { macroCondition, getOwnConfig } from '@embroider/macros';

export default class MockLoginRoute extends Route {
  @service() session;
  @service() store;

  queryParams = {
    page: {
      refreshModel: true,
    },
  };

  beforeModel() {
    this.session.prohibitAuthentication('index');
  }

  model(params) {
    if (macroCondition(getOwnConfig().controle)) {
      return this.store.query('account', {
        include: 'gebruiker.bestuurseenheden',
        filter: {
          ':id:': '3a91ff60-07c1-4136-ac5e-55cf401e0956', // Mock admin account id
        },
        page: { size: 1 },
      });
    } else {
      const filter = {
        provider: 'https://github.com/lblod/mock-login-service',
      };
      if (params.gemeente)
        filter.gebruiker = { bestuurseenheden: params.gemeente };
      return this.store.query('account', {
        include: 'gebruiker.bestuurseenheden',
        filter: filter,
        page: { size: 10, number: params.page },
        sort: 'gebruiker.achternaam',
      });
    }
  }
}
