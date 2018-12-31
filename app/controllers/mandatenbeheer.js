import Controller from '@ember/controller';
import moment from 'moment';
import { computed } from '@ember/object';

export default Controller.extend({
  selectedBestuursorgaan: computed('startDate', function() {
    if(this.get('startDate')) {
      return this.model.bestuursorgaanWithBestuursperioden.find(o => o.bindingStart.toDateString() == new Date(this.get('startDate')).toDateString());
    } else {
      return this.model.bestuursorgaanWithBestuursperioden.firstObject;
    }
  }),

  actions: {
    select(selectedBestuursorgaan) {
      this.set('selectedBestuursorgaan', selectedBestuursorgaan);
      this.set('startDate', moment(selectedBestuursorgaan.bindingStart).format('YYYY-MM-DD'));
    },
  }
});
