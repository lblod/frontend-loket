import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { notEmpty } from '@ember/object/computed';

export default Component.extend({
  store: service(),

  tagName: '',

  isValid: notEmpty('model.start'),

  async init() {
    this._super(...arguments);
    const bestuursfunctie = await this.model.bekleedt;
    const bestuursfunctieCode = await bestuursfunctie.rol;
    const bestuursfunctieCodeUri = await bestuursfunctieCode.uri;

    let queryParams = {};
    if (bestuursfunctieCodeUri == 'http://data.vlaanderen.be/id/concept/BestuursfunctieCode/855489b9-b584-4f34-90b2-39aea808cd9f') { // Leidend ambtenaar
      queryParams =  {
        filter: { ':uri:': 'http://data.vlaanderen.be/id/concept/functionarisStatusCode/45b4b155-d22a-4eaf-be3a-97022c6b7fcd' } // aangesteld
      };
    } else {
      queryParams =  {
        sort: 'label',
        page: { size: 100 }
      };
    }

    const statusOptions = await this.store.query('functionaris-status-code', queryParams);
    this.set('statusOptions', statusOptions);
  }
});
