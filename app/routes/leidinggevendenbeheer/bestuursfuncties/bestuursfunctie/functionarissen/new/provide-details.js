import Route from '@ember/routing/route';

export default Route.extend({
  async model(params) {
    return await this.store.createRecord('functionaris', {
      bekleedt: this.modelFor('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie'),
      isBestuurlijkeAliasVan: await this.store.findRecord('persoon', params.persoon_id)
    });
  },

  actions: {
    willTransition() {
      this.controller.reset();
    }
  }
});
