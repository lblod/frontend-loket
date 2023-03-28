/* eslint-disable ember/no-classic-components, ember/no-classic-classes, ember/require-tagless-components, ember/no-component-lifecycle-hooks, ember/no-actions-hash */

import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  currentSession: service(),

  async didReceiveAttrs() {
    this._super();
    if (this.duplicatedMandataris)
      this.set('_duplicatedMandataris', this.duplicatedMandataris);
    const options = this.mandatarissen.filter((m) => {
      return m != this.currentMandataris;
    });
    this.set('options', options);
  },

  actions: {
    select(duplicatedMandataris) {
      this.set('_duplicatedMandataris', duplicatedMandataris);
      this.onSelect(duplicatedMandataris);
    },
  },
});
