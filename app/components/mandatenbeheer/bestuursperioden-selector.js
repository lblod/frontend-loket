import Component from '@ember/component';
import { computed } from '@ember/object';
import moment from 'moment';

export default Component.extend({
  selectedStartDate: null,

  selectedBestuursorgaan: computed('selectedStartDate', 'bestuursperioden.@each.bindingStart', function() {
    if (this.selectedStartDate) {
      return this.options.find( (o) => {
        return o.bindingStart.toDateString() == new Date(this.selectedStartDate).toDateString();
      });
    } else {
      return this.options.firstObject;
    }
  }),

  actions: {
    selectBestuursorgaan(bestuursorgaan) {
      this.onSelect(moment(bestuursorgaan.bindingStart).format('YYYY-MM-DD'));
    }
  }
});
