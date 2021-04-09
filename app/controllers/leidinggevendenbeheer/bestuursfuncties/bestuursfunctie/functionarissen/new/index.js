import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class LeidinggevendenbeheerBestuursfunctiesBestuursfunctieFunctionarissenNewIndexController extends Controller {
  @action
    choosePeriode(person){
      this.transitionToRoute('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen.new.periode', person.get('id'));
    }

  @action
    createNewPerson() {
      this.transitionToRoute('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen.new-person');
    }

  @action
    cancel() {
      this.transitionToRoute('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen.index');
    }
}
