import Controller from '@ember/controller';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';

export default class LeidinggevendenbeheerBestuursfunctiesBestuursfunctieFunctionarissenNewPeriodeController extends Controller {

  @task(function * () {
    yield this.model.save();
    this.transitionToRoute('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen.index');
  }) save;

  @action
  goBackToSearch() {
    if (this.model) {
      this.model.deleteRecord();
      this.model = null;
    }
    this.transitionToRoute('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen.new');
  }

  @action
  cancel() {
    if (this.model)
      this.model.deleteRecord();
    this.transitionToRoute('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen.index');
  }
}
