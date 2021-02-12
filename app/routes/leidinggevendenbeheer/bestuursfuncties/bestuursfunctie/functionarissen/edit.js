import Route from '@ember/routing/route';

export default class LeidinggevendenbeheerBestuursfunctiesBestuursfunctieFunctionarissenEditRoute extends Route {
  
  model(params) {
    return this.store.findRecord('functionaris', params.functionaris_id);
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.set('initialStatus', model.status);
  }
}
