import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  currentSession: service(),

  async beforeModel() {
    const bestuurseenheid = await this.get('currentSession.group');
    this.set('bestuurseenheid', bestuurseenheid);
  },

  async model(params) {
    const model = await this.store.findRecord('bestuursfunctie', params.id);

    if (! await model.contactinfo) {
      const info = await this.store.createRecord('contact-punt');
      await info.save();
      
      model.set('contactinfo', info);
      await model.save();
    }

    return model;
  },

  async setupController(controller, model) {
    this._super(controller, model);
    controller.set('bestuurseenheid', this.bestuurseenheid);
  }
});