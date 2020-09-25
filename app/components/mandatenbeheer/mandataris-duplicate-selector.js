import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  currentSession: service(),

  async didReceiveAttrs(){
    if(this.duplicatedMandataris)
      this.set('_duplicatedMandataris', this.duplicatedMandataris);
    const options = this.mandatarissen.filter(m => m.start);
    this.set('options', options);
  },

  actions: {
    select(duplicatedMandataris){
      this.set('_duplicatedMandataris', duplicatedMandataris);
      this.onSelect(duplicatedMandataris);
    }
  }
});
