import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
export default Route.extend(UnauthenticatedRouteMixin, {
  session: service(),
  async model() {
    try {
      await this.session.authenticate('authenticator:torii', 'acmidm-oauth2');
    }
    catch(e) {
      return 'Fout bij het aanmelden. Gelieve opnieuw te proberen.';
    }
  }
});
