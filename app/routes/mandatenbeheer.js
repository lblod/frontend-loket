import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
  currentSession: service(),

  queryParams: {
    startDate: { refreshModel: true }
  },

  beforeModel() {
    if (!this.currentSession.canAccessMandaat)
      this.transitionTo('index');
  },

  async model(params){
    this.startDate = params.startDate;
    const bestuurseenheid = await this.get('currentSession.group');

    return RSVP.hash({
      bestuurseenheid: bestuurseenheid,
      bestuursorganen: this.getBestuursorganenInTijdByStartDate(bestuurseenheid.get('id')),
      bestuursperioden: this.getBestuursperioden(bestuurseenheid.get('id')),
      startDate: this.startDate
    });
  },

  /*
   * Returns bestuursorgaan in tijd starting on the given start date
   * for all bestuursorganen of the given bestuurseenheid.
  */
  getBestuursorganenInTijdByStartDate: async function(bestuurseenheidId){
    const bestuursorganen = await this.store.query('bestuursorgaan', {
      'filter[bestuurseenheid][id]': bestuurseenheidId,
      'filter[heeft-tijdsspecialisaties][:has:bevat]': true // only organs with a political mandate
    });
    const organenStartingOnStartDate = await Promise.all( bestuursorganen.map( (orgaan) => {
      return this.getBestuursorgaanInTijdByStartDate(orgaan.get('id'), this.startDate);
    }));
    return organenStartingOnStartDate.filter(orgaan => orgaan); // filter null values
  },

  getBestuursorgaanInTijdByStartDate: async function(bestuursorgaanId, startDate){
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

  /*
   * Get all the bestuursorganen in tijd of a bestuursorgaan with at least 1 political mandate.
   * @return Array of bestuursorganen in tijd ressembling the bestuursperiodes
   */
  getBestuursperioden: async function(bestuurseenheidId){
    return (await this.store.query('bestuursorgaan', {
      'filter[is-tijdsspecialisatie-van][bestuurseenheid][id]': bestuurseenheidId,
      'filter[:has:bevat]': true // only organs with a political mandate
    }));
  }

});
