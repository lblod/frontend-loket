import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default class BbcdrRoute extends Route.extend(AuthenticatedRouteMixin) {
  @service() currentSession;

  beforeModel() {
    if (!this.currentSession.canAccessBbcdr)
      this.transitionTo('index');
  }
}

