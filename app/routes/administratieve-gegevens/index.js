import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { inject as service } from '@ember/service';
export default Route.extend(AuthenticatedRouteMixin, {
  currentSession: service(),
  model(){
    return this.get('currentSession.group');
  },
  async afterModel(model) {
    await model.get('classificatie');
  }
});
