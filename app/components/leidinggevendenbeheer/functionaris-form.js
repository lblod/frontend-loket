import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed }  from '@ember/object';

export default Component.extend({
  store: service(),
  hasErrors: computed('model.start', function() { return ! this.functionaris.start }),

  async fetchStatuses() {
    if(!this.aangesteldStatus) {
      const a = await this.store.query('functionaris-status-code', {
          filter: { ':uri:': 'http://data.vlaanderen.be/id/concept/functionarisStatusCode/45b4b155-d22a-4eaf-be3a-97022c6b7fcd' }
        });
      this.set('aangesteldStatus', a.firstObject);
    }
  
    if(!this.waarnemendStatus) {
      const w = await this.store.query('functionaris-status-code', {
        filter: { ':uri:': 'http://data.vlaanderen.be/id/concept/functionarisStatusCode/188fc9c0-dae7-43b2-b2b3-6122c1594479' }
      });
      this.set('waarnemendStatus', w.firstObject);
    }
  
    if (!this.defaultStatus) {
      this.set('defaultStatus', this.aangesteldStatus);
    }
  },
  
  async didReceiveAttrs() {
    this.fetchStatuses();
    if (! await this.functionaris.status) {
      this.functionaris.set('status', this.defaultStatus);
    }
  },

  actions: {
    async setStatus(statusId) {
      if (statusId == this.aangesteldStatus.id) {
        this.functionaris.set('status', this.aangesteldStatus);
      } else if (statusId == this.waarnemendStatus.id) {
        this.functionaris.set('status', this.waarnemendStatus);
      }
    }
  }
});
