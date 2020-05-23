import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),

  async didReceiveAttrs(){
    await this.initComponentProperties();
  },

  async initComponentProperties(){
    let bestuursorganenIds = this.bestuursorganen.map(o => o.get('id'));
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
        'bekleedt.bestuursfunctie',
        'beleidsdomein',
        'heeft-lidmaatschap.binnen-fractie'
      ].join(',')
    };

    let mandatarissen = await this.store.query('mandataris', queryParams);
    this.set('mandatarissen', mandatarissen.toArray());
  },

  actions: {
    async updateVerifiedMandaten(){
      this.set('persoon.verifiedMandaten', !this.get('persoon.verifiedMandaten'));
      await this.get('persoon').save();
    },
    mandatarisSaved(mandataris){
      //here you can do some additional validation, e.g. validation over all mandaten for a person
      this.onMandatarisSaved(mandataris);
    },
    async mandatarisCreateCanceled(mandataris){
      await mandataris.destroy();
      this.mandatarissen.removeObject(mandataris);
    },
    async createMandataris(){
      const mandataris = this.store.createRecord('mandataris');
      mandataris.set('isBestuurlijkeAliasVan',await this.persoon);
      this.mandatarissen.pushObject(mandataris);
    },
    finish(){
      this.onFinish();
    }
  }
});
