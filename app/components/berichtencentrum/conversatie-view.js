import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames      : ['col--4-12 col--9-12--m col--12-12--s container-flex--contain'],
  router          : service(),
  showExitModal   : false,
  actions: {
    close(){
      this.close();
    }
  }
});
