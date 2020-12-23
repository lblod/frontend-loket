import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { action } from '@ember/action';
import { tracked } from '@glimmer/tracking';

export default class LeidinggevendenbeheerBestuursfunctiesBestuursfunctieContactInfoController extends Controller {
  showConfirmationDialog = false;

  @tracked bestuurseenheid; 
  @tracked bestuursfunctie;
  
  get isDirty() {
    return this.model.hasDirtyAttributes || this.model.get('adres.hasDirtyAttributes');
  }

  exit() {
    this.set('showConfirmationDialog', false);
    this.transitionToRoute('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen', this.bestuursfunctie.id);
  }

  @task(function* () {
    const address = yield this.model.adres;
    yield address.save();
    yield this.model.save();
    this.exit();
  }) save;

  @task(function* () {
    const address = yield this.model.adres;
    address.rollbackAttributes();
    this.model.rollbackAttributes();
    this.exit();
  }) resetChanges;

  @task(function* (adresProperties) {
    const address = yield this.model.adres;
    if (adresProperties) {
      address.setProperties(adresProperties);
    } else {
      address.eachAttribute(propName => address.set(propName, null));
    }
  }) updateAdres;

  @action
    cancel() {
      if (!this.isDirty)
        this.exit();
      else
        this.set('showConfirmationDialog', true);
    }
  }
