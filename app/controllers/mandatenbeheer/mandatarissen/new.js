import Controller from '@ember/controller';
import { isBlank } from '@ember/utils';
import { observer } from '@ember/object';

export default Controller.extend({
  queryParams: ['persoonId'],
  persoonId: '',
  persoonIdObserver: observer('persoonId', async function() {
    if (isBlank(this.get('persoonId'))) return;
    const persoon = await this.get('store').findRecord('persoon', this.get('persoonId'));
    this.setPersoon(persoon);
  }),
  clearProperties(){
    this.set('mandataris', null);
  },
  setPersoon(persoon){
    const mandataris = this.get('store').createRecord('mandataris');
    mandataris.set('isBestuurlijkeAliasVan', persoon);
    this.set('mandataris', mandataris);
  },
  actions: {
    save(){
      this.transitionToRoute('mandatenbeheer.mandatarissen');
    },
    cancel(){
      this.transitionToRoute('mandatenbeheer.mandatarissen');
    }
  }
});
