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
      this.bestuursfunctie.id,
    );
  }

  save = task(async () => {
    const address = await this.model.adres;
    await address.save();
    await this.model.save();
    this.exit();
  });

  resetChanges = task(async () => {
    const address = await this.model.adres;
    address.rollbackAttributes();
    this.model.rollbackAttributes();
    this.exit();
  });

  updateAdres = task(async (adresProperties) => {
    const address = await this.model.adres;
    if (adresProperties) {
      address.setProperties(adresProperties);
    } else {
      address.eachAttribute((propName) => address.set(propName, null));
    }
  });

  @action
  cancel() {
    if (!this.isDirty) this.exit();
    else this.showConfirmationDialog = true;
  }
}
