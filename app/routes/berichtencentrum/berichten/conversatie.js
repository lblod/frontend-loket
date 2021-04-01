import Route from '@ember/routing/route';

export default class BerichtencentrumBerichtenConversatieRoute extends Route {
  model(params) {
    return this.store.findRecord('conversatie', params.id);
  }
}
