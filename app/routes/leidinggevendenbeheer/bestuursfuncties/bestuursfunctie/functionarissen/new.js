import Route from '@ember/routing/route';

export default class LeidinggevendenbeheerBestuursfunctiesBestuursfunctieFunctionarissenNewRoute extends Route {
  setupController( controller, model ) {
    super.setupController(...arguments);
    const bestuursfunctie = this.modelFor('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie');
    controller.set('bestuursfunctie', bestuursfunctie);
    controller.set('functionaris', null);
    controller.set('isCreatingNewPerson', false);
  }
}
