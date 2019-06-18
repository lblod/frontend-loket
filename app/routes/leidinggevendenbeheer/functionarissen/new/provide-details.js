import Route from '@ember/routing/route';

export default Route.extend({
  async model(params) {

    const bestuursfunctieId = this.paramsFor('leidinggevendenbeheer.functionarissen').bestuursfunctie_id;

    const functionaris = await this.store.createRecord('functionaris', {
      bekleedt: await this.store.findRecord('bestuursfunctie', bestuursfunctieId),
      isBestuurlijkeAliasVan: await this.store.findRecord('persoon', params.persoon_id)
    });

    return functionaris;
  },

  setupController(controller, model) {
    this._super(controller, model);

    const parentController = this.controllerFor('leidinggevendenbeheer.functionarissen.new');
    parentController.set('childController', controller);
  },

  actions: {
    willTransition() {
      this.controller.reset();
    }
  }
});
