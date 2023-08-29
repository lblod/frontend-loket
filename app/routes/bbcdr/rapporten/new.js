import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class BbcdrRapportenNewRoute extends Route {
  @service store;

  async model() {
    let status = (
      await this.store.query('document-status', {
        filter: { ':uri:': 'http://data.lblod.info/document-statuses/concept' },
      })
    ).at(0);

    return this.store.createRecord('bbcdr-report', { status });
  }
}
