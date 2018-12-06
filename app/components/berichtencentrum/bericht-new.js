import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { empty } from '@ember/object/computed';
import { computed } from '@ember/object';
import { A } from '@ember/array';

export default Component.extend({

    inhoud                  : '',
    van                     : '',
    auteur                  : '',
    naar                    : '',

    bijlagen                : A(['bijlaag 1', 'bijlaag 2']),
    
    isSendButtonDisabled: computed ('isSendButtonDisabled', function(){

        return  empty('inhoud')
                ||
                empty('van')
                ||
                empty('auteur')
                ||
                empty('naar')
                ||
                empty('bijlagen');
    }),
    
    router: service(),
    store: service(),

    actions: {

        cancelMessage: function() {
            this.closeMe();
        },
        
        async sendMessage(event) {

            event.preventDefault();
            
            await this.get('store').createRecord('bericht', {
                
                inhoud                  : this.inhoud,
                aangekomen              : Date.parse(new Date().toISOString),
                verzonden               : Date.parse(new Date().toISOString),
                van                     : this.van,
                auteur                  : this.auteur,
                naar                    : this.naar,

                bijlagen                : this.bijlagen
                
            }).save();

            this.closeMe();
        },
    
        deleteFile: function() {},
        
        addFile: function() {},
    },
    
    closeMe: function() {
        this.router.transitionTo('berichtencentrum.berichten');
    },
});
