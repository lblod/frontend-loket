import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class EredienstMandatenbeheerNewPersonController extends Controller {
  @service() router;

  @action
  onCreate(persoon) {
    const mandataris = this.store.createRecord('worship-mandatee');
    mandataris.set('isBestuurlijkeAliasVan', persoon);

    this.router.transitionTo(
      'eredienst-mandatenbeheer.mandataris.edit',
      mandataris
    );
  }

  @action
  onCancel() {
    this.send('reloadModel');
    this.router.transitionTo('eredienst-mandatenbeheer.new');
  }
}
