import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  store: service(),
  currentSession: service(),

  async didReceiveAttrs(){
    this.set('_fractie', this.fractie);
    let bestuurseenheid = await this.get('currentSession.group');
    let bestuursorganen = await this.getBestuursorganen(bestuurseenheid.id);
    this.set('bestuursorganen', bestuursorganen);
    this.set('bestuursorganenId', bestuursorganen.map( o => o.get('id') ));
  },

  getBestuursorganen: async function(bestuurseenheidId){
    const bestuursorganen = await this.store.query('bestuursorgaan', {'filter[bestuurseenheid][id]': bestuurseenheidId });
    const organenInTijd = await Promise.all(bestuursorganen.map(orgaan => this.getLastBestuursorgaanInTijd(orgaan.get('id'))));
    return organenInTijd.filter(orgaan => orgaan);
  },

  getLastBestuursorgaanInTijd: async function(bestuursorgaanId){
    const queryParams = {
      sort: '-binding-start',
      'filter[is-tijdsspecialisatie-van][id]': bestuursorgaanId,
      page: { size: 1 }
    };

    const organen = await this.store.query('bestuursorgaan', queryParams);
    return organen.firstObject;
  },

  searchByName: task(function* (searchData) {
    yield timeout(300);
    let queryParams = {
      sort:'naam',
      include: 'fractietype',
      filter: {
        naam: searchData,
        'bestuursorganen-in-tijd': {
          id: this.bestuursorganenId.join(',')
        }
      }
    };
    let fracties = yield this.store.query('fractie', queryParams);
    fracties = fracties.filter(f => !f.get('fractietype.isOnafhankelijk'));

    //sets dummy
    if('onafhankelijk'.includes(searchData.toLowerCase())){
      fracties.pushObject(yield this.createNewOnafhankelijkeFractie());
    }

    return fracties;
  }),

  async createNewOnafhankelijkeFractie(){
    let onafFractie = (await this.store.findAll('fractietype')).find(f => f.get('isOnafhankelijk'));
    return this.store.createRecord('fractie', {
                                                naam: 'Onafhankelijk',
                                                fractietype: onafFractie,
                                                bestuursorganenInTijd: this.bestuursorganen,
                                                bestuurseenheid: this.bestuurseeneenheid
                                              });
  },

  actions: {
    select(fractie){
      this.set('_fractie', fractie);
      this.onSelect(fractie);
    }
  }
});
