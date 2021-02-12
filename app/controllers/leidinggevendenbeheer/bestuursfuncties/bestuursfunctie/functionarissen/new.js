import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class LeidinggevendenbeheerBestuursfunctiesBestuursfunctieFunctionarissenNewController extends Controller {
  @service() store;

  @tracked functionaris = null;
  @tracked defaultStatus = null;
  @tracked bestuursfunctie;
  @tracked functionaris;
  @tracked isCreatingNewPerson;

  @task(function * (person) {
    if (!this.defaultStatus) {
      const status = yield this.store.query('functionaris-status-code', {  // aangesteld status
        filter: { ':uri:': 'http://data.vlaanderen.be/id/concept/functionarisStatusCode/45b4b155-d22a-4eaf-be3a-97022c6b7fcd' },
        page: { size: 1 }
      });
      this.defaultStatus = status.firstObject;
    }

    const functionaris = this.store.createRecord('functionaris', {
      bekleedt: this.bestuursfunctie,
      isBestuurlijkeAliasVan: person,
      status: this.defaultStatus,
      start: new Date()
    });

    this.functionaris = functionaris;
  }) createFunctionaris;

  @task(function * () {
    yield this.functionaris.save();
    this.transitionToRoute('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen.index');
  }) save;

  @action
    cancel() {
      if (this.functionaris)
        this.functionaris.deleteRecord();
      this.transitionToRoute('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen.index');
    }

  @action
    goBackToSearch() {
      if (this.functionaris) {
        this.functionaris.deleteRecord();
        this.functionaris = null;
      }
      this.isCreatingNewPerson = false;
    }
}
