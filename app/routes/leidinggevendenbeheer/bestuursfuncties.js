import Route from '@ember/routing/route';

export default Route.extend({

  async model() {
    const b = this.modelFor('leidinggevendenbeheer');
    const controller = this.controllerFor('leidinggevendenbeheer.bestuursfuncties');
    controller.set('bestuurseenheid', b);
    return this.store.query('bestuursfunctie', {
      'filter[bevat-in][is-tijdsspecialisatie-van][bestuurseenheid][:id:]':b.id
    });
  }
});
