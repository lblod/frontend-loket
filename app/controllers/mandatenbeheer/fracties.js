import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import moment from 'moment';
export default Controller.extend({
  page: 0,
  size: 20,

  isAdding: false,
   
  saveNewFractie: task(function * (fractieNaam) {
    let fractie = this.store.createRecord('fractie', {
      naam: fractieNaam,
      fractietype: null,
      bestuursorganenInTijd: this.bestuursorganen,
      bestuurseenheid: yield this.bestuurseenheid
    });
    //TODO: think again this flow
    yield this.updateExistingFractie.perform(fractie);
  }),
   
  updateExistingFractie: task(function * (fractie) {
    yield fractie.save();
    this.set("isAdding", false);
    yield this.updateFractiesOnChangeBestuursPeriode(this.selectedOrgPeriode);

  }),
  
  async updateFractiesOnChangeBestuursPeriode(periode){
    this.transitionToRoute('mandatenbeheer.fracties', {
      queryParams: {
        startDate: moment(periode.bindingStart).format('YYYY-MM-DD')
      }
    });
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
