import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
  currentSession: service(),

  queryParams: {
   startDate: 'startDate',
  },
  startDate: Date('2019-01-01'),

  getBestuursorganen: async function(bestuurseenheidId){
    const bestuursorganen = await this.store.query('bestuursorgaan', {'filter[bestuurseenheid][id]': bestuurseenheidId });
    const organenInTijd = await Promise.all(bestuursorganen.map(orgaan => this.getBestuursorganenInTijdFromStartDate(orgaan.get('bindingStart'), this.startDate)));
    return organenInTijd.filter(orgaan => orgaan);
  },

  getBestuursorganenInTijdFromStartDate: async function(bestuursorgaanId, bestuursorgaanStartDate){
    const queryParams = {
      sort: '-binding-start',
      'filter[is-tijdsspecialisatie-van][id]': bestuursorgaanId,
      'filter[binding-start]': bestuursorgaanStartDate.toISOString().slice(0, 10)
    };

    const organen = await this.store.query('bestuursorgaan', queryParams);
    return organen.firstObject;
  },

  beforeModel() {
    if (!this.currentSession.canAccessMandaat)
      this.transitionTo('index');
  },

  // What is not working :
  // - No data in the table even though the request seem to be working well
  // - Same for "Toon totalen en bestuursperiodes"
  //
  // What is left to do :
  // - Handle redirections (redirect to the most recent orgaan ?)

  async model(params){
    this.startDate = new Date(params.startDate);

    const bestuurseenheid = await this.get('currentSession.group');
    return RSVP.hash({
      'bestuurseenheid': bestuurseenheid,
      'bestuursorganen': this.getBestuursorganen(bestuurseenheid.get('id'))
    });
  }
});
