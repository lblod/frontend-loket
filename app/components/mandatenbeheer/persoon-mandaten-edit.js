import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),

  async didReceiveAttrs(){
    await this.initComponentProperties();
  },

  async initComponentProperties(){
    let bestuursorganenIds = this.get('bestuursorganen').map(o => o.get('id'));
    let queryParams = {
      filter: {
        'is-bestuurlijke-alias-van': {
          id: this.get('persoon.id')
        },
        'bekleedt': {
          'bevat-in': {
            'id': bestuursorganenIds.join(',')
          }
        }
      },
      include: [
        'is-bestuurlijke-alias-van',
        'bekleedt',
        'bekleedt.bestuursfunctie',
        'beleidsdomein',
        'heeft-lidmaatschap',
        'heeft-lidmaatschap.binnen-fractie'
      ].join(',')
    };

    let mandatarissen = await this.get('store').query('mandataris', queryParams);
    this.set('mandatarissen', mandatarissen.toArray());
  },

  actions: {
    mandatarisSaved(mandataris){
      //here you can do some additional validation, e.g. validation over all mandaten for a person
    },
    async mandatarisCreateCanceled(mandataris){
      await mandataris.destroy();
      this.get('mandatarissen').removeObject(mandataris);
    },
    async createMandataris(){
      const mandataris = this.get('store').createRecord('mandataris');
      mandataris.set('isBestuurlijkeAliasVan',await this.get('persoon'));
      this.get('mandatarissen').pushObject(mandataris);
    },
    finish(){
      this.get('onFinish')();
    }
  }
});
