import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';

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
    
    const bestuursorgaan = await this.get('currentSession.group');
    this.set('bestuursorgaan', bestuursorgaan);
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('bestuurseenheid', this.bestuurseenheid);
    controller.set('orgPerioden', this.orgPerioden);
    controller.set('selectedOrgPeriode', this.orgPerioden.firstObject)
  },

  model() {
    return this.store.query('fractie', {'filter[bestuursorganen-in-tijd][id]': this.bestuursorgaan.id});
  },

});
