import Route from '@ember/routing/route';

export default Route.extend({
  async model(params) {
    const status = await this.store.query('functionaris-status-code', {  // aangesteld status
      filter: { ':uri:': 'http://data.vlaanderen.be/id/concept/functionarisStatusCode/45b4b155-d22a-4eaf-be3a-97022c6b7fcd' },
      page: { size: 1 }
    });
    const persoon = await this.store.findRecord('persoon', params.persoon_id);

    return this.store.createRecord('functionaris', {
      bekleedt: this.modelFor('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie'),
      isBestuurlijkeAliasVan: persoon,
      status: status.firstObject
    });
  }
});
