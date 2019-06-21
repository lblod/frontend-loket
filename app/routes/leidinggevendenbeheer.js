import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
  currentSession: service(),

  beforeModel() {
    if (!this.currentSession.canAccessLeidinggevenden)
      this.transitionTo('index');
  },

  model() {
    return this.get('currentSession.group');
  }

});
