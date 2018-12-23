import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  currentSession: service(),

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
    async commit() {
      // get all variables
      let emailAddress = this.emailAddress;
      let wilMailOntvangen = this.wilMailOntvangen;
      let group = await this.get('currentSession.group');

      // close the popup
      this.close(); // close the popup

      // save the lot
      group.set('mailAdres', emailAddress);
      group.set('wilMailOntvangen', wilMailOntvangen);
      await group.save();
    }
  }

});
