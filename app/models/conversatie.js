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

    laatsteBerichtDatum: computed('berichten.@each.verzonden', function(){
        return this.get('berichten').then(function (res){
          return res.sortBy('verzonden').get('lastObject.verzonden');
        });
    }),

    laatsteBerichtDoor: computed('berichten.@each.verzonden', function(){
        return this.get('berichten').then(function (res){
          return res.sortBy('verzonden').get('lastObject.van').then(function (res2){
            return res2;
          });
        });
    }),
    
    addReaction (bericht) {
        this.berichten.pushObject(bericht);
    },
    
});
