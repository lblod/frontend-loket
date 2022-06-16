import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class PersoneelsbeheerIndexRoute extends Route {
  @service router;

  beforeModel() {
    this.router.transitionTo('personeelsbeheer.personeelsaantallen.index');
  }
}
