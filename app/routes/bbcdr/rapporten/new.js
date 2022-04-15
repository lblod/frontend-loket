import Route from '@ember/routing/route';

export default class BbcdrRapportenNewRoute extends Route {
  async model() {
    let status = (
      await this.store.query('document-status', {
        filter: { ':uri:': 'http://data.lblod.info/document-statuses/concept' },
      })
    ).firstObject;

    return this.store.createRecord('bbcdr-report', { status });
  }
}
