import Route from '@ember/routing/route';

export default class BerichtencentrumBerichtenConversatieRoute extends Route {
  model(params) {
    return this.store.find('conversatie', params.id);
  }
}
