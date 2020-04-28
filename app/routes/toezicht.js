import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend( AuthenticatedRouteMixin, {
  currentSession: service(),

  beforeModel() {
    if (!this.currentSession.canAccessToezicht){
      this.transitionTo('index');
    } else {
      this.transitionTo(this.currentSession._group.submissionRoute);
    }
  }
});
