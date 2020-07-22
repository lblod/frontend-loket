import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  currentSession: service('current-session'),
  async model() {
    const bestuursfunctie = this.modelFor('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie');
    this.set('bestuursfunctie', bestuursfunctie);
    const bestuurseenheidClassificatie = await (await this.currentSession.group).classificatie;
    this.set('bestuurseenheidClassificatie', bestuurseenheidClassificatie.label);

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
  },

  setupController(controller, model) {
    this._super(controller, model);
    if(this.bestuurseenheidClassificatie !== "OCMW") {
      controller.set('allowed', true);
    }
    controller.set('bestuurseenheid', this.modelFor('leidinggevendenbeheer'));
    controller.set('bestuursfunctie', this.bestuursfunctie);
  }
});
