import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class EredienstMandatenbeheerNewController extends Controller {
  @service() router;
  @service() store;

  @action
  selectPersoon(persoon) {
    const mandataris = this.store.createRecord('worship-mandatee');
    mandataris.set('isBestuurlijkeAliasVan', persoon);

    this.router.transitionTo(
      'eredienst-mandatenbeheer.mandataris.edit',
      mandataris
    );
  }

  @action
  createNewPerson() {
    this.router.transitionTo('eredienst-mandatenbeheer.new-person');
  }

  @action
  cancel() {
    this.router.transitionTo('eredienst-mandatenbeheer.mandatarissen');
  }
}
