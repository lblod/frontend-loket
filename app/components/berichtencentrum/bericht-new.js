import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { empty } from '@ember/object/computed';
import { computed } from '@ember/object';

export default Component.extend({

    berichtTypeCommunicatie: '',
    berichtDossiernummer: '',
    berichtTitle: '',
    berichtReactietermijn: '',
    berichtLaatsteBericht: '',
    berichtLaatstVerstuurdDoor: '',
    berichtTekst: '',
    
    isSendButtonDisabled: computed ('isSendButtonDisabled', function(){

        return  empty('berichtTypeCommunicatie')
                &&
                empty('berichtDossiernummer')
                &&
                empty('berichtTitle')
                &&
                empty('berichtReactietermijn')
                &&
                empty('berichtLaatsteBericht')
                &&
                empty('berichtLaatstVerstuurdDoor')
                &&
                empty('berichtTekst');
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

                typeCommunicatie        : this.berichtTypeCommunicatie,
                dossiernummer           : this.berichtDossiernummer,
                reactietermijn          : Date.parse(this.berichtReactietermijn),
                laatsteBericht          : this.berichtLaatsteBericht,
                laatstVerstuurdDoor     : this.berichtLaatstVerstuurdDoor,
                messageBody             : this.berichtTekst,
                aangekomenDatum         : null,
                verzondenDatum          : Date.parse(new Date().toISOString),
                title                   : this.berichtTitle
                
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
