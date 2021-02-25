import Route from '@ember/routing/route';

export default class BbcdrRapportenEditRoute extends Route {
  model(params) {
    return this.store.findRecord('bbcdr-report', params.id, {
      include: [
        'files',
        'last-modifier',
        'status'
      ].join(',')
    });
  }
}