import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';

export default Controller.extend({
  store: service(),

  functionaris: null,
  defaultStatus: null,

  createFunctionaris: task(function * (person) {
    if (!this.defaultStatus) {
      const status = yield this.store.query('functionaris-status-code', {  // aangesteld status
        filter: { ':uri:': 'http://data.vlaanderen.be/id/concept/functionarisStatusCode/45b4b155-d22a-4eaf-be3a-97022c6b7fcd' },
        page: { size: 1 }
      });
      this.set('defaultStatus', status.firstObject);
    }

    const functionaris = this.store.createRecord('functionaris', {
      bekleedt: this.bestuursfunctie,
      isBestuurlijkeAliasVan: person,
      status: this.defaultStatus,
      start: new Date()
    });

    this.set('functionaris', functionaris);
  }),

  save: task(function * () {
    yield this.functionaris.save();
    this.transitionToRoute('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen.index');
  }),

  actions: {
    cancel() {
      if (this.functionaris)
        this.functionaris.deleteRecord();
      this.transitionToRoute('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen.index');
    },
    goBackToSearch() {
      if (this.functionaris) {
        this.functionaris.deleteRecord();
        this.set('functionaris', null);
      }
      this.set('isCreatingNewPerson', false);
    }
  }
});
