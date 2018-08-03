import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Component.extend({
  store: service(),
  classNameBindings:['isOpen:js-accordion--open'],
  isOpen:false,

  getMandatenOrgaan(bestuursorgaan){
    const queryParams = {
      filter: {
        'bevat-in': {
          id: bestuursorgaan.get('id')
        }
      },
      include: [
        'bestuursfunctie',
        'bevat-in',
        'bevat-in.is-tijdsspecialisatie-van'
      ].join(',')
    };
    return this.get('store').query('mandaat', queryParams);
  },

  getMandatarissenMandaat(mandaat){
    const queryParams = {
      filter: {
        bekleedt: {
          id: mandaat.get('id')
        }
      },
      'filter[:gte:einde]': new Date().toISOString().slice(0, 10),
      page: { size: 1 }
    };
    return this.get('store').query('mandataris', queryParams);
  },

  getMandatarissenTotals: task(function* (){
    const bstOrgs = this.get('bestuursorganen');

    const mapMandtnOrgs = yield Promise.all(bstOrgs.map(async (o) => {
     return {org: o, mandtn: await this.getMandatenOrgaan(o)};
    }));

    const mapMandtnMandarissen = async (mandaat) => {
      return {
        naam: await mandaat.get('bestuursfunctie.label'),
        aantal: (await this.getMandatarissenMandaat(mandaat)).meta.count
      };
    };

    const mapMandtrsOrgs = yield Promise.all(mapMandtnOrgs.map(async (e) => {
      return {
        orgaan: e.org,
        mandaten: await Promise.all(e.mandtn.map(mapMandtnMandarissen))
      };
    }));

    this.set('mandatarissenTotals', mapMandtrsOrgs);

    return mapMandtrsOrgs;

  }).drop(),

  actions:{
    toggleOpen(){
      if(!this.get('isOpen'))
        this.getMandatarissenTotals.perform();
      this.set('isOpen', !this.get('isOpen'));
    }
  }
});
