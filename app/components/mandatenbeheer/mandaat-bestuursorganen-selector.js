import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),

  didReceiveAttrs(){
    this.set('_mandaat', this.mandaat);
    this.set('mandaten', this.populateMandaten());
  },

  populateMandaten(){
    const queryParams = {
      sort:'bestuursfunctie.label',
      include: 'bestuursfunctie',
      'filter[bevat-in][id]': this.bestuursorganen.map(o => o.get('id')).join(',')
    };
    return this.store.query('mandaat', queryParams);

  },

  actions: {
    select(mandaat){
      this.set('_mandaat', mandaat);
      this.onSelect(mandaat);
    }
  }
});
