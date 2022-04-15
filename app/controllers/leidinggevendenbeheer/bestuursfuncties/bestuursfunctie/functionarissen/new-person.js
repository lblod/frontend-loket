import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class LeidinggevendenbeheerBestuursfunctiesBestuursfunctieFunctionarissenNewPersonController extends Controller {
  @service() router;

  @action
  onCreate(user) {
    this.router.transitionTo(
      'leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen.new.periode',
      user.get('id')
    );
  }

  @action
  onCancel() {
    this.router.transitionTo(
      'leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen.new'
    );
  }
}
