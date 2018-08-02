import Controller from '@ember/controller';
import { task, timeout } from 'ember-concurrency';
import ENV from 'frontend-loket/config/environment';

export default Controller.extend({
  init() {
    this._super(...arguments);
    this.set('footer', ENV['vo-webuniversum']['footer']);
  }
});
