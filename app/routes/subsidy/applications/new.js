import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class SubsidyApplicationsNewRoute extends Route {
  @service currentSession

  async model() {
    const bestuurseenheid = await this.currentSession.group;

    const subsidieAanvraag = this.store.createRecord('subsidie-aanvraag', {
      bestuurseenheid: bestuurseenheid,
      aanvraagdatum: new Date()
    });
    await subsidieAanvraag.save();

    return subsidieAanvraag;
  }

  afterModel(model) {
    this.transitionTo('subsidy.applications.edit', model.id);
  }
}
