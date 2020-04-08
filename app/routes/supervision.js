import Route from '@ember/routing/route';
import {inject as service} from '@ember/service';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default class SupervisionRoute extends Route.extend(AuthenticatedRouteMixin) {
  @service
  currentSession

  beforeModel() {
    console.log("entered supervision route");
    if (!this.currentSession.canAccessToezicht) {
      console.log("not a toezicht member, can not reach this page");
      this.transitionTo('index');
    }
  }
}
