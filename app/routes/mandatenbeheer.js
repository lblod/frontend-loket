import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
  currentSession: service(),

  queryParams: {
    startDate: { refreshModel: true }
  },

  getBestuursorganen: async function(bestuurseenheidId){
    const bestuursorganen = await this.store.query('bestuursorgaan', {'filter[bestuurseenheid][id]': bestuurseenheidId });
    const organenInTijd = await Promise.all(bestuursorganen.map(orgaan => this.getBestuursorganenInTijdFromStartDate(orgaan.get('id'), this.startDate)));
    return organenInTijd.filter(orgaan => orgaan);
  },

  getBestuursorganenInTijdFromStartDate: async function(bestuursorgaanId, startDate){
    const queryParams = {
      page: { size: 1 },
      sort: '-binding-start',
      'filter[is-tijdsspecialisatie-van][id]': bestuursorgaanId
    };

    if (startDate)
      queryParams['filter[binding-start]'] = startDate;

    const organen = await this.store.query('bestuursorgaan', queryParams);
    return organen.firstObject;
  },

  beforeModel() {
    if (!this.currentSession.canAccessMandaat)
      this.transitionTo('index');
  },

  // What is not working :
  // - Same for "Toon totalen en bestuursperiodes"

  async model(params){
    this.startDate = params.startDate;

    const bestuurseenheid = await this.get('currentSession.group');
    return RSVP.hash({
      'bestuurseenheid': bestuurseenheid,
      'bestuursorganen': this.getBestuursorganen(bestuurseenheid.get('id'))
    });
  }
});
