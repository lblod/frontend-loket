import Controller from '@ember/controller';
import { task } from 'ember-concurrency';

export default class LeidinggevendenbeheerBestuursfunctiesBestuursfunctieFunctionarissenNewPeriodeController extends Controller {

  @task(function * () {
    yield this.model.save();
    this.transitionToRoute('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen.index');
  }) save;

  @task(function * () {
    if (this.model) {
      yield this.model.deleteRecord();
      this.model = null;
    }
    this.transitionToRoute('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen.new');
  }) goBackToSearch;

  @task(function * () {
    if (this.model) {
      yield this.model.deleteRecord();
    }
    this.transitionToRoute('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen.index');
  }) cancel;
}
