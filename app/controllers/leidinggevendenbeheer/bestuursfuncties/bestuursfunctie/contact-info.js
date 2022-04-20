import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class LeidinggevendenbeheerBestuursfunctiesBestuursfunctieContactInfoController extends Controller {
  @service() router;

  @tracked showConfirmationDialog = false;
  @tracked bestuurseenheid;
  @tracked bestuursfunctie;

  get isDirty() {
    return (
      this.model.hasDirtyAttributes ||
      this.model.get('adres.hasDirtyAttributes')
    );
  }

  exit() {
    this.showConfirmationDialog = false;
    this.router.transitionTo(
      'leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen',
      this.bestuursfunctie.id
    );
  }

  @task
  *save() {
    const address = yield this.model.adres;
    yield address.save();
    yield this.model.save();
    this.exit();
  }

  @task
  *resetChanges() {
    const address = yield this.model.adres;
    address.rollbackAttributes();
    this.model.rollbackAttributes();
    this.exit();
  }

  @task
  *updateAdres(adresProperties) {
    const address = yield this.model.adres;
    if (adresProperties) {
      address.setProperties(adresProperties);
    } else {
      address.eachAttribute((propName) => address.set(propName, null));
    }
  }

  @action
  cancel() {
    if (!this.isDirty) this.exit();
    else this.showConfirmationDialog = true;
  }
}
