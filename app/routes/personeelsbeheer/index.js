import Route from '@ember/routing/route';

export default class PersoneelsbeheerIndexRoute extends Route {
  beforeModel() {
    this.transitionTo('personeelsbeheer.personeelsaantallen.index');
  }
}
