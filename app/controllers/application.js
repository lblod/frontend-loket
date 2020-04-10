import Controller from '@ember/controller';
import { equal } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service(),
  currentSession: service(),
  router: service(),

  isIndex: equal('router.currentRouteName', 'index'),
});
