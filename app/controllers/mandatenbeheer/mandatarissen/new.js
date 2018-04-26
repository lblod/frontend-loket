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
  setPersoon(persoon){
    this.transitionToRoute('mandatenbeheer.mandatarissen.edit', persoon.get('id'));
  },
  actions: {
    cancel(){
      this.transitionToRoute('mandatenbeheer.mandatarissen');
    }
  }
});
