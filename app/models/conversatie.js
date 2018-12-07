import { hasMany } from 'ember-data/relationships';
import DS from 'ember-data';
const { attr } = DS;
import { computed } from '@ember/object';

export default DS.Model.extend({

    dossiernummer:      attr('string'),
    betreft:            attr('string'),
    typeCommunicatie:   attr('string'),
    reactietermijn:     attr('string'),

    berichten:          hasMany('bericht'),

    laatsteBericht: computed ('', function(){
        return 'not computed yet';
    }),

    laatsteBerichtVerstuurdDoor: computed ('', function(){
        return 'not computed yet';
    }),

});
