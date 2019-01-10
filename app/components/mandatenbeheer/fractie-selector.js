import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  store: service(),
  currentSession: service(),

  async didReceiveAttrs(){
    if(this.fractie)
      this.set('_fractie', this.fractie);
    if(this.bestuursorganen){
      this.set('bestuursorganenId', this.bestuursorganen.map( o => o.get('id') ));
    }
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
