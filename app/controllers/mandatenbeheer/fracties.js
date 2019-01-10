import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { A } from '@ember/array';
export default Controller.extend({
  //sort: 'is-bestuurlijke-alias-van.achternaam',
  page: 0,
  size: 20,

  isAdding: false,
   
  saveNewFractie: task(function * (fractieNaam) {
    let fractie = this.store.createRecord('fractie', {
      naam: fractieNaam,
      fractietype: null,
      bestuursorganenInTijd: A([this.selectedOrgPeriode]),
      bestuurseenheid: yield this.bestuurseenheid
    });
    //TODO: think again this flow
    this.updateExistingFractie.perform(fractie);
  }),
   
  updateExistingFractie: task(function * (fractie) {
    yield fractie.save();
    yield this.updateFractiesOnChangeBestuursPeriode(this.selectedOrgPeriode);
    this.set("isAdding", false);
  }),
  
  async updateFractiesOnChangeBestuursPeriode(periode){
    let fracties = await this.store.query('fractie', {'filter[bestuursorganen-in-tijd][id]': periode.id});
    this.set('model', fracties);
  },
  
  actions: {
    
    addFractie() {
      this.set("isAdding", true);
    },
    
    async createFractie(fractieNaam) {
      this.saveNewFractie.perform(fractieNaam);
    },

    updateFractie(fractie) {
      this.updateExistingFractie.perform(fractie);
    },

    selectPeriode(periode) {
      this.set('selectedOrgPeriode', periode);
      this.updateFractiesOnChangeBestuursPeriode(periode);
    }
  }
});
