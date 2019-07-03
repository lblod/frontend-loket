import Route from '@ember/routing/route';

export default Route.extend({
  setupController(controller) {
    this._super(...arguments);
    const bestuursfunctie = this.modelFor('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie');
    controller.set('bestuursfunctie', bestuursfunctie);
    controller.set('functionaris', null);
    controller.set('isCreatingNewPerson', false);
  }
});
