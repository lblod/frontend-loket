import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class LeidinggevendenbeheerBestuursfunctiesBestuursfunctieFunctionarissenNewIndexController extends Controller {
  @service() router;

  @action
    choosePeriode(person){
      this.router.transitionTo('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen.new.periode', person.get('id'));
    }

  @action
    createNewPerson() {
      this.router.transitionTo('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen.new-person');
    }

  @action
    cancel() {
      this.router.transitionTo('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen.index');
    }
}
