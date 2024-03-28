import Service, { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { loadAccountData } from 'frontend-loket/utils/account';

export default class ImpersonationService extends Service {
  @service store;
  @tracked impersonatedAccount;

  get isImpersonating() {
    return Boolean(this.impersonatedAccount);
  }

  async load() {
    const response = await fetch('/impersonations/current');

    if (response.ok) {
      const result = await response.json();
      const impersonatedAccountId =
        result.data.relationships.impersonates.data.id;
      if (impersonatedAccountId) {
        await this.#loadImpersonatedAccount(impersonatedAccountId);
      }
    }
  }

  async impersonate(accountId) {
    const response = await fetch('/impersonations', {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
      body: JSON.stringify({
        data: {
          type: 'impersonations',
          relationships: {
            impersonates: {
              data: {
                type: 'resource',
                id: accountId,
              },
            },
          },
        },
      }),
    });

    if (response.ok) {
      await this.#loadImpersonatedAccount(accountId);
    } else {
      const result = await response.json();
      throw new Error(
        'An exception occurred while trying to impersonate someone: ' +
        JSON.stringify(result.errors),
      );
    }
  }

  async stopImpersonation() {
    if (this.isImpersonating) {
      const response = await fetch('/impersonations/current', {
        method: 'DELETE',
      });

      if (response.ok) {
        this.impersonatedAccount = null;
      }
    }
  }

  async #loadImpersonatedAccount(accountId) {
    const account = await loadAccountData(this.store, accountId);

    this.impersonatedAccount = account;

    const user = account.gebruiker;
    const roles = account.roles;
    const group = user.group;
    // const classification = group.belongsTo('classificatie').value();
    const classification = await group.classificatie;

    console.log(user.fullName, roles, group.naam, classification.label)

    // let groupId = this.session.data.authenticated.relationships.group.data.id;
    // this._group = await this.store.findRecord('bestuurseenheid', groupId, {
    //   include: 'classificatie',
    //   reload: true,
    // });
    // this._groupClassification = await this._group.classificatie;
  }
}
