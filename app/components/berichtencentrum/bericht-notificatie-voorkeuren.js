import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({


    isHidden: true,
    store: service(),
    currentSession: service(),

    wilMailOntvangen: true,
    emailAddress: 'mail@adres.com',

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
