import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { notEmpty } from '@ember/object/computed';

export default Component.extend({
  store: service(),

  tagName: '',

  isValid: notEmpty('model.start'),

  async init() {
    this._super(...arguments);
    const statusOptions = await this.store.query('functionaris-status-code', {
      sort: 'label',
      page: { size: 100 }
    });
    this.set('statusOptions', statusOptions);
  }
});
