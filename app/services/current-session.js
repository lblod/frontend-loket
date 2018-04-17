import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';
export default Service.extend({
  session: service('session'),
  store: service('store'),
  async load() {
    if (this.get('session.isAuthenticated')) {
      const session = this.get('session');
      const account = await this.get('store').find('account', get(session, 'data.authenticated.relationships.account.data.id'));
      const user = await account.get('gebruiker');
      const group = await this.get('store').find('bestuurseenheid', get(session, 'data.authenticated.relationships.group.data.id'));
      this.set('account', account);
      this.set('user', user);
      this.set('group', group);
    }
  }
});
