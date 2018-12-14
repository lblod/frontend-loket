import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { empty } from '@ember/object/computed';
import { computed } from '@ember/object';
import { A } from '@ember/array';
import { sort } from '@ember/object/computed';
import DS from 'ember-data';

export default Component.extend({

    inhoud      : '',
    bijlagen    : A([]),
    conversatie : null,
    
    router: service(),
    store: service(),
    currentSession: service(),
    
    isExpanded: false,

    naarWie: computed ('naarWie', function() {
        return  DS.PromiseObject.create({
            promise: this.naar()
        });
    }),
    
    isSendButtonDisabled: computed ('isSendButtonDisabled', function(){
        return  empty('inhoud');
    }),

    firstMessage: function () {
        return this.sortedMessages.get('firstObject');
    },

    naar: async function () {

        return this.get('store').query ('bestuurseenheid', {
            
            filter: { naam : 'Agentschap Binnenlands Bestuur' }
            
        }).then(function(records) {

            this.naarWie = records.get('firstObject').fullName;
            console.log('narr: ' + this.naarWie);

            return records.get('firstObject');

        });
    },

    onDateSorter: Object.freeze(['verzonden']),
    sortedMessages: sort('conversatie.berichten', 'onDateSorter'),

    actions: {
        
        async verstuurBericht() {

            if (this.isSendButtonDisabled)
                return;

            const bestuurseenheid   = await this.get('currentSession.group');
            const user              = await this.get('currentSession.user');

            //let naar = await this.anotherName();
            
            try {
                this.collapse();

                let reactie = await this.get('store').createRecord('bericht', {
                
                    inhoud                  : this.inhoud,
                    aangekomen              : new Date(),
                    verzonden               : new Date(),
                    van                     : bestuurseenheid,
                    auteur                  : user,
                    naar                    : await this.naar(),

                    bijlagen                : this.bijlagen
                    
                });

                await reactie.save();
                this.conversatie.addReaction(reactie);
                await this.conversatie.save();
            }
            catch (err) {
                alert (err.message);
            }

        },

        attachFile: function (file) {
            this.bijlagen.pushObject(file);
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
