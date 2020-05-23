import Component from '@ember/component';
import { computed } from '@ember/object';
import moment from 'moment';

export default Component.extend({
  tagName: '',
  selectedStartDate: null,

  getUniqueBestuursperiodes(bestuursorganen){
    let options = bestuursorganen
        .map(b => { return { bindingStart: b.bindingStart, bindingEinde: b.bindingEinde }; })
        .sortBy('bindingStart').reverse();
    return options.filter((o, i) => (options.map(periode => JSON.stringify(periode))).indexOf(JSON.stringify(o)) === i);
  },

  didReceiveAttrs() {
    this._super(...arguments);
    this.set('_options', this.getUniqueBestuursperiodes(this.options) || []);
  },

  selectedBestuursorgaan: computed('selectedStartDate', 'bestuursperioden.@each.bindingStart', function() {
    if (this.selectedStartDate) {
      return this._options.find( (o) => {
        return o.bindingStart.toDateString() == new Date(this.selectedStartDate).toDateString();
      });
    } else {
      return this._options[0];
    }
  }),

  actions: {
    selectBestuursorgaan(bestuursorgaan) {
      this.onSelect(moment(bestuursorgaan.bindingStart).format('YYYY-MM-DD'));
    }
  }
});
