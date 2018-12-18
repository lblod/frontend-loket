import DS           from 'ember-data';
import { hasMany }  from 'ember-data/relationships';
import { computed } from '@ember/object';

const { attr } = DS;

export default DS.Model.extend({

    dossiernummer   : attr('string'),
    betreft         : attr('string'),
    typeCommunicatie: attr('string'),
    reactietermijn  : attr('string'),

    berichten       : hasMany('bericht'),

    laatsteBericht: computed ('', function(){
        return 'not computed yet';
    }),

    laatsteBerichtVerstuurdDoor: computed ('', function(){
        return 'not computed yet';
    }),

    addReaction (bericht) {
        this.berichten.pushObject(bericht);
    },
    
});
