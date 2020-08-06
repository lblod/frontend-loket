import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: ['au-o-grid__item au-u-2-5@medium'],
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
