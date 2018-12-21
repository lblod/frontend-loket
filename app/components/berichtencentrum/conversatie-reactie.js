import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';
import { sort } from '@ember/object/computed';

export default Component.extend({

    router: service(),
    store: service(),
    currentSession: service(),

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

    init() {
        this._super(...arguments);
        this.inhoud = '';
        this.bijlagen = A([]);
        this.isExpanded = false;
    },

    actions: {
        
        async verstuurBericht() {

            if (this.inhoud == '')
                return;

            const bestuurseenheid   = await this.get('currentSession.group');
            const user              = await this.get('currentSession.user');
            
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

        console.log('conversatie provided:')
        console.log(this.conversatie);
        
        this.get('store')
            .query ('bestuurseenheid', {filter: { naam : 'Agentschap Binnenlands Bestuur' }})
            .then((records) => {
                let u = records.get('firstObject');
                this.set('originator', u);
            });

        this.set('currentUser', this.get('currentSession.user'));
    }

});
