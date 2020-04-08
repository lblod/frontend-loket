import Controller from '@ember/controller';
import { equal } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import ENV from 'frontend-loket/config/environment';

export default Controller.extend({
  session: service(),
  currentSession: service(),

  isIndex: equal('currentRouteName', 'index'),

  init() {
    this._super(...arguments);
    this.set('header', ENV['vo-webuniversum']['header']);
  }
});
