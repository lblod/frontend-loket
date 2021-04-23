import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';
import { task, waitForProperty } from 'ember-concurrency';


export default class CurrentSessionService extends Service {
  @service('session') session;
  @service('store') store;

  async load() {
    if (this.session.isAuthenticated) {
      const session = this.session;
      const account = await this.store.findRecord('account', get(session, 'data.authenticated.relationships.account.data.id'));
      const user = await account.get('gebruiker');
      const group = await this.store.findRecord('bestuurseenheid', get(session, 'data.authenticated.relationships.group.data.id'));
      const roles = await get(session, 'data.authenticated.data.attributes.roles');
      this.set('_account', account);
      this.set('_user', user);
      this.set('_roles', roles);
      this.set('_group', group);

      // The naming is off, but account,user,roles are taken for the
      // promises in a currently public API.
      this.setProperties({
        accountContent: account,
        userContent: user,
        rolesContent: roles,
        groupContent: group
      });

      this.set('canAccessToezicht', this.canAccess('LoketLB-toezichtGebruiker'));
      this.set('canAccessBbcdr', this.canAccess('LoketLB-bbcdrGebruiker'));
      this.set('canAccessMandaat', this.canAccess('LoketLB-mandaatGebruiker'));
      this.set('canAccessBerichten', this.canAccess('LoketLB-berichtenGebruiker'));
      this.set('canAccessLeidinggevenden', this.canAccess('LoketLB-leidinggevendenGebruiker'));
      this.set('canAccessPersoneelsbeheer', this.canAccess('LoketLB-personeelsbeheer'));
      this.set('canAccessSubsidies', this.canAccess('LoketLB-subsidies'));
    }
  }

  canAccess(role) {
    return this._roles.includes(role);
  }

  // constructs a task which resolves in the promise
  @task
  *makePropertyPromise(property) {
    yield waitForProperty(this, property);
    return this.get(property);
  }

  // this is a promise
  get account() {
    return this.makePropertyPromise.perform('_account');
  }
  // this contains a promise
  get user() {
    return this.makePropertyPromise.perform('_user');
  }
  // this contains a promise
  get group() {
    return this.makePropertyPromise.perform('_group');
  }
}
