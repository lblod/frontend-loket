import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  isHidden: true,
  wilMailOntvangen: true,
  emailAddress: 'mail@adres.com',

  didReceiveAttrs() {
    this._super(...arguments);
    this
      .get('currentSession.group')
      .then((group) => {
        this.set('wilMailOntvangen', group.get("wilMailOntvangen"));
        this.set('emailAddress', group.get("mailAdres"));
      });
  },

  actions: {
    show() {
      this.set("isHidden", false);
    },

    cancel() {
      this.set("isHidden", true);
    },

    async commit() {
      this.cancel();
      
      let group = await this.get('currentSession.group');
      group.set('mailAdres', this.emailAddress);
      group.set('wilMailOntvangen', this.wilMailOntvangen);
      await group.save();
    }
  }

});
