import Route from '@ember/routing/route';

export default Route.extend({

  async model(params) {
    const controller = this.controllerFor('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.contact-info');
    controller.set('bestuurseenheid', this.modelFor('leidinggevendenbeheer'));

    const bestuursfunctie = await this.store.findRecord('bestuursfunctie', params.id);
    this.set('bestuursfunctie', bestuursfunctie);

    if (! await bestuursfunctie.contactinfo) {
      const info = await this.store.createRecord('contact-punt');
      await info.save();

      bestuursfunctie.set('contactinfo', info);
      await bestuursfunctie.save();
    }

    return await bestuursfunctie.contactinfo;
  },

  setupController(controller, model) {
    this._super(controller, model)
    controller.set('bestuursfunctie', this.bestuursfunctie);
  },

  actions: {
    willTransition() {
      this.controller.reset();
    }
  }
});
