import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

export default Route.extend({
  currentSession: service(),

  getBestuursorganen: async function(bestuurseenheidId){
    let bestuursorganen = await this.get('store').query('bestuursorgaan', {'filter[bestuurseenheid][id]': bestuurseenheidId });
    let organenInTijd = await Promise.all(bestuursorganen.map(orgaan => this.getLastBestuursorgaanInTijd(orgaan.get('id'))));
    return organenInTijd.filter(orgaan => orgaan);
  },

  getLastBestuursorgaanInTijd: async function(bestuursorgaanId){
    let queryParams = {
      'sort': '-binding-start',
      'filter[is-tijdsspecialisatie-van][id]': bestuursorgaanId
    };

    let organen = await this.get('store').query('bestuursorgaan', queryParams);
    return organen.firstObject;
  },

  async model(){
    let bestuurseenheid = await this.get('currentSession.group');
    return RSVP.hash({
      'bestuurseenheid': bestuurseenheid,
      'bestuursorganen': this.getBestuursorganen(bestuurseenheid.get('id'))
    });
  }
});
