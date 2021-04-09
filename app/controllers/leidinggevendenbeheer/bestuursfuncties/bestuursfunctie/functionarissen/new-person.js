import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class LeidinggevendenbeheerBestuursfunctiesBestuursfunctieFunctionarissenNewPersonController extends Controller {
  @action
    onCreate(user) {
      this.transitionToRoute('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen.new.periode', user.get('id'));
  }

  @action
    onCancel() {
      this.transitionToRoute('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen.new');
  }
}
