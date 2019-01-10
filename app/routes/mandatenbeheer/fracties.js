import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import moment from 'moment';

export default Route.extend({
  currentSession: service(),

  async beforeModel() {

    const mandatenbeheer = await this.modelFor('mandatenbeheer');
    this.set('mandatenbeheer', mandatenbeheer);
    this.set('bestuurseenheid', mandatenbeheer.bestuurseenheid);
    this.set("orgPerioden", mandatenbeheer.bestuursorgaanWithBestuursperioden);

    const bestuursorganen = mandatenbeheer.bestuursorganen;
    this.set('bestuursorganen', bestuursorganen);
    this.set('bestuursorganenIds', bestuursorganen.map(o => o.get('id')));

    const bestuurseenheid = await this.get('currentSession.group');
    this.set('bestuurseenheid', bestuurseenheid);
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('bestuurseenheid', this.bestuurseenheid);
    controller.set('orgPerioden', this.orgPerioden);
    controller.set('selectedOrgPeriode', this.bestuursorganen.firstObject);
    controller.set('bestuursorganen', this.bestuursorganen);
  },

  model() {
    let startDate = this.paramsFor('mandatenbeheer')['startDate'];
    if(!startDate){
      startDate = moment(this.bestuursorganen.firstObject.bindingStart).format('YYYY-MM-DD');
    }
    return this.store.query('fractie', {'filter[bestuursorganen-in-tijd][binding-start]': startDate});
  },

  actions: {
    reloadModel(){
      this.refresh();
    }
  }

});
