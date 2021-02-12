import Route from '@ember/routing/route';

export default class LeidinggevendenbeheerBestuursfunctiesBestuursfunctieContactInfoRoute extends Route {

  async model() {
    const bestuursfunctie = this.modelFor('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie');
    this.set('bestuursfunctie', bestuursfunctie);
    if (!await bestuursfunctie.contactinfo) {
      const info = await this.store.createRecord('contact-punt');
      await info.save();

      bestuursfunctie.set('contactinfo', info);
      await bestuursfunctie.save();
    }

    const contactinfo = await bestuursfunctie.get('contactinfo');
    if (!(await contactinfo.adres)) {
      const adres = await this.store.createRecord('adres');
      await adres.save();

      contactinfo.set('adres', adres);
      await contactinfo.save();
    }

    return contactinfo;
  }

  setupController( controller, model ) {
    super.setupController(...arguments);
    controller.set('bestuurseenheid', this.modelFor('leidinggevendenbeheer'));
    controller.set('bestuursfunctie', this.bestuursfunctie);
  }
}
