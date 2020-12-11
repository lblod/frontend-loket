import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default class SubsidyRoute extends Route.extend(AuthenticatedRouteMixin) {

  @service currentSession

  beforeModel() {
    if (!this.currentSession.canAccessSubsidies)
      this.transitionTo('index');
  }
}
