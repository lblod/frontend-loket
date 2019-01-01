import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  router: service(),
  classNames:['u-padding--trl--small u-border--light--bottom'],
  actions: {
    close() {
      this.close();
    }
  }
});
