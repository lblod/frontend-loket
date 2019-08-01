import Controller from '@ember/controller';
import { computed }  from '@ember/object';
import { task } from 'ember-concurrency';

export default Controller.extend({
  showConfirmationDialog: false,

  isDirty: computed('model.hasDirtyAttributes', 'model.adres.hasDirtyAttributes', function() {
    return this.model.hasDirtyAttributes || this.model.get('adres.hasDirtyAttributes');
  }),

  exit() {
    this.set('showConfirmationDialog', false);
    this.transitionToRoute('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen', this.bestuursfunctie.id);
  },

  save: task(function* () {
    const address = yield this.model.adres;
    yield address.save();
    yield this.model.save();
    this.exit();
  }),

  resetChanges: task(function* () {
    const address = yield this.model.adres;
    address.rollbackAttributes();
    this.model.rollbackAttributes();
    this.exit();
  }),

  updateAdres: task(function* (adresProperties) {
    const address = yield this.model.adres;
    if (adresProperties) {
      address.setProperties(adresProperties);
    } else {
      address.eachAttribute(propName => address.set(propName, null));
    }
  }),

  actions: {
    cancel() {
      if (!this.isDirty)
        this.exit();
      else
        this.set('showConfirmationDialog', true);
    }
  }
});
