import Controller from '@ember/controller';
import { task } from 'ember-concurrency';

export default class LeidinggevendenbeheerBestuursfunctiesBestuursfunctieFunctionarissenNewPeriodeController extends Controller {

  @task(function * () {
    yield this.model.save();
    this.transitionToRoute('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen.index');
  }) save;
}
