import Route from '@ember/routing/route';

export default Route.extend({

  async model() {
    const bestuursfunctie = this.modelFor('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie');
    this.set('bestuursfunctie', bestuursfunctie);

    if (!await bestuursfunctie.contactinfo) {
      const info = await this.store.createRecord('contact-punt');
      await info.save();

      bestuursfunctie.set('contactinfo', info);
      await bestuursfunctie.save();
    }

    if (!await bestuursfunctie.get('contactinfo.adres')) {
      const adres = await this.store.createRecord('adres');
      await adres.save();

      bestuursfunctie.set('contactinfo.adres', adres);
      await bestuursfunctie.save();
    }

    return bestuursfunctie.contactinfo;
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('bestuurseenheid', this.modelFor('leidinggevendenbeheer'));
    controller.set('bestuursfunctie', this.bestuursfunctie);
  }
});
