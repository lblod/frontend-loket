import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class LeidinggevendenbeheerBestuursfunctiesBestuursfunctieFunctionarissenNewIndexController extends Controller {
  @service() store;
  @service() router;

  @tracked functionaris = null;
  @tracked defaultStatus = null;
  @tracked bestuursfunctie;
  @tracked functionaris;
  @tracked isCreatingNewPerson;


  @action
    choosePeriode(person){
      this.transitionToRoute('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen.new.periode', person.get('id'))
    }

  @action
    goBackToSearch() {
      if (this.functionaris) {
        this.functionaris.deleteRecord();
        this.functionaris = null;
      }
      this.isCreatingNewPerson = false;
    }


  @action
  cancel() {
    this.transitionToRoute('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen.index');
  }
}
