import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: ['col--5-12 col--9-12--m col--12-12--s container-flex--contain'],
  router: service(),
  showExitModal: false,

  async didReceiveAttrs() {
    const messages = await this.model.berichten;
    const sortedMessages = messages.sortBy('verzonden');
    this.set('berichten', sortedMessages);
  },

  actions: {
    close(){
      this.close();
    }
  }
});
