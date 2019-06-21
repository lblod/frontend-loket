import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed }  from '@ember/object';

export default Component.extend({
  store: service(),
  hasErrors: computed('model.start', function() { return ! this.functionaris.start; }),

  async init() {
    this._super(...arguments);
    const statusOptions = await this.store.query('functionaris-status-code', {
      sort: 'label',
      page: { size: 100 }
    });
    this.set('statusOptions', statusOptions);
  }
});
