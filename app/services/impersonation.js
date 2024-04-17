import Service, { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { loadAccountData } from 'frontend-loket/utils/account';

export default class ImpersonationService extends Service {
  @service store;
  // @tracked impersonatedAccount;
  @tracked originalAccount;
  @tracked originalGroup;

  get isImpersonating() {
    return Boolean(this.originalAccount);
  }

  async load() {
    const response = await fetch('/impersonations/current');

    if (response.ok) {
      const result = await response.json();
      const originalAccountId =
        result.data.relationships['original-resource'].data.id;

      if (originalAccountId) {
        const { account } = await this.#loadAccount(originalAccountId);
        this.originalAccount = account;
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

    if (!response.ok) {
      // await this.#loadAccount(accountId);
      // } else {
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
        this.originalAccount = null;
        this.originalGroup = null;
      }
    }
  }

  async #loadAccount(accountId) {
    const account = await loadAccountData(this.store, accountId);

    // TODO; we need to retrieve the group info in some way, but ACM/IDM accounts/users don't have a relationship to it...

    return {
      account,
    }
  }
}
