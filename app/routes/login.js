import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  store: service('store'),
  model() {
    return this.get('store').query('account', {'include': 'gebruiker,gebruiker.bestuurseenheden'});
  }
});
