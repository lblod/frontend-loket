import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { oneWay } from '@ember/object/computed';

export default Component.extend({
  store: service(),

  _statusCode: oneWay('statusCode'),

  async didReceiveAttrs(){
    const statusCodes = await this.store.query('mandataris-status-code', { sort: 'label' });
    this.set('statusCodes', statusCodes);
  },

  actions: {
    select(code){
      this.set('_statusCode', code);
      this.onSelect(code);
    }
  }
});
