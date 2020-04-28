import Route from '@ember/routing/route';
import {inject as service} from '@ember/service';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default class SupervisionRoute extends Route.extend(AuthenticatedRouteMixin) {
  @service
  currentSession

  beforeModel() {
    if (!this.currentSession.canAccessToezicht){
      this.transitionTo('index');
    } else {
      this.transitionTo(this.currentSession._group.submissionRoute);
    }
  }
}
