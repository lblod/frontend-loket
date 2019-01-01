import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),

  didReceiveAttrs(){
    this.set('_statusCode', this.statusCode);
    this.set('statusCodes', this.populate());
  },

  populate(){
    let queryParams = {
      sort:'label'
    };
    return this.store.query('mandataris-status-code', queryParams);
  },

  actions: {
    select(code){
      this.set('_statusCode', code);
      this.onSelect(code);
    }
  }
});
