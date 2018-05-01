import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
  currentSession: service(),

  getBestuursorganen: async function(bestuurseenheidId){
    const bestuursorganen = await this.get('store').query('bestuursorgaan', {'filter[bestuurseenheid][id]': bestuurseenheidId });
    const organenInTijd = await Promise.all(bestuursorganen.map(orgaan => this.getLastBestuursorgaanInTijd(orgaan.get('id'))));
    return organenInTijd.filter(orgaan => orgaan);
  },

  getLastBestuursorgaanInTijd: async function(bestuursorgaanId){
    const queryParams = {
      'sort': '-binding-start',
      'filter[is-tijdsspecialisatie-van][id]': bestuursorgaanId
    };

    const organen = await this.get('store').query('bestuursorgaan', queryParams);
    return organen.firstObject;
  },

  async model(){
    const bestuurseenheid = await this.get('currentSession.group');
    return RSVP.hash({
      'bestuurseenheid': bestuurseenheid,
      'bestuursorganen': this.getBestuursorganen(bestuurseenheid.get('id'))
    });
  }
});
