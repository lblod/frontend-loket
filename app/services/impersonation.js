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
  }
}
