import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { oneWay } from '@ember/object/computed';

export default Component.extend({
  store: service(),

  _mandaat: oneWay('mandaat'),
  bestuursorganen: null,

  async didReceiveAttrs(){
    const mandaten = await this.store.query('mandaat', {
      sort: 'bestuursfunctie.label',
      include: 'bestuursfunctie',
      'filter[bevat-in][id]': this.bestuursorganen.map(o => o.get('id')).join(',')
    });
    this.set('mandaten', mandaten);
  },

  actions: {
    select(mandaat){
      this.set('_mandaat', mandaat);
      this.onSelect(mandaat);
    }
  }
});
