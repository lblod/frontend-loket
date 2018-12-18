import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({


    isHidden: true,
    store: service(),
    currentSession: service(),
    emailAddress: 'mail@adres.com',

    actions: {

        show() {
            this.set("isHidden", false);
            console.log("show in component level");
        },

        cancel() {
            this.set("isHidden", true);
        },

        async commit() {
            
            console.log('commit on the component level');
            console.log("-------------------------------------------------------");
            
            let group = await this.get('currentSession.group');
            console.log("current email address:");
            console.log(group.mailAdres);
            console.log("-------------------------------------------------------");
            
            group.set('emailAdres', this.emailAddress);
            
            console.log("email: ", group.get('emailAdres'));
            console.log("-------------------------------------------------------");
            
            
            await this.get('store')
            .query ('bestuurseenheid', {filter: { naam : group.get('naam') }})
            .then((records) => {
                
                let g = records.get('firstObject');
                g.save();
                console.log("g");
                console.log(g);
                console.log("-------------------------------------------------------");

            });
            
            /*
            await this.get('store').createRecord('bericht', {
                
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
            */
            this.cancel();
        }
    }
});
