import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({

    classNames      : ['col--4-12 col--9-12--m col--12-12--s container-flex--contain'],
    router          : service(),
    store           : service(),
    currentSession  : service(),
    showExitModal   : false,
  
    actions: {
  
      async closeVenster(){
        this.router.transitionTo('berichtencentrum.berichten');
      },
    }
  });