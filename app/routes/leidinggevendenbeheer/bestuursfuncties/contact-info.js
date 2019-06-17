import Route from '@ember/routing/route';

export default Route.extend({

  async model(params) {
    const controller = this.controllerFor('leidinggevendenbeheer.bestuursfuncties');
    controller.set('bestuurseenheid', this.modelFor('leidinggevendenbeheer'));

    const model = await this.store.findRecord('bestuursfunctie', params.id);

    if (! await model.contactinfo) {
      const info = await this.store.createRecord('contact-punt');
      await info.save();

      model.set('contactinfo', info);
      await model.save();
    }

    return model;
  }
});
