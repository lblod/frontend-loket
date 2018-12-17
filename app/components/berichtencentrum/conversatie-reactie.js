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
    
    isSendButtonDisabled: computed ('isSendButtonDisabled', function(){
        return  empty('inhoud') && false;
    }),

    firstMessage: function () {
        return this.sortedMessages.get('firstObject');
    },

    naar: async function () {

        return this.get('store').query ('bestuurseenheid', {
            
            filter: { naam : 'Agentschap Binnenlands Bestuur' }
            
        }).then(function(records) {

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
                    naar                    : this.originator,

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
    },

    currentUser: null,
    originator: null,

    didInsertElement() {

        this._super(...arguments);
        
        this.get('store')
            .query ('bestuurseenheid', {filter: { naam : 'Agentschap Binnenlands Bestuur' }})
            .then((records) => {
                let u = records.get('firstObject');
                this.set('originator', u);
            });

        this.set('currentUser', this.get('currentSession.user'));
    }

});
