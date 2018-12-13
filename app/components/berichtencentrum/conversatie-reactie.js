import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { empty } from '@ember/object/computed';
import { computed } from '@ember/object';
import { A } from '@ember/array';
import bericht from '../../models/bericht';
import { sort } from '@ember/object/computed';
import EmberObject from '@ember/object';

export default Component.extend({

    inhoud      : '',
    bijlagen    : A([]),
    conversatie : null,
    
    router: service(),
    store: service(),
    currentSession: service(),
    
    isExpanded: false,
    
    isSendButtonDisabled: computed ('isSendButtonDisabled', function(){
        return  empty('inhoud');
    }),

    firstMessage: function () {
        return this.sortedMessages.get('firstObject');
    },

    onDateSorter: Object.freeze(['verzonden']),
    sortedMessages: sort('conversatie.berichten', 'onDateSorter'),

    actions: {
        
        async verstuurBericht() {

            const bestuurseenheid = await this.get('currentSession.group');
            let user = await this.get('currentSession.user')
            
            try {
                this.collapse();

                let reactie = await this.get('store').createRecord('bericht', {
                
                    inhoud                  : this.inhoud,
                    aangekomen              : new Date(),
                    verzonden               : new Date(),
                    van                     : bestuurseenheid,
                    auteur                  : user,
                    naar                    : this.firstMessage().van,

                    bijlagen                : this.bijlagen
                    
                });

                this.conversatie.addReaction(reactie);
                await reactie.save();
            }
            catch (err) {
                alert (err.message);
            }

        },

        attachFile: function (file) {
            this.bijlagen.pushObject(file);
            console.log ('A new file was added\n' + this.bijlagen);
        },

        deleteFile: function (file) {
            this.bijlagen.removeObject(file);
        },

        expandMe: function() {
            this.expand();
        },

        collapseMe: function () {
            this.collapse();
        }
    },

    collapse: function() {
        this.set('isExpanded', false);
    },

    expand: function() {
        this.set('isExpanded', true);
    }

});
