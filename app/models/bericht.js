import DS from 'ember-data';
const { attr } = DS;
import { computed } from '@ember/object';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default DS.Model.extend({

    verzonden:  attr('date'),
    aangekomen: attr('date'),
    inhoud:     attr('string'),
    van:        belongsTo('bestuurseenheid'),
    auteur:     belongsTo('gebruiker'),
    naar:       belongsTo('bestuurseenheid'),

    bijlagen:   hasMany('file'),

    niceFormatAangekomen: computed ('aangekomen', function(){
        try {
            return this.niceFormatDate(this.aangekomen);
        }
        catch (err) {
            return 'no date';
        }
    }),

    niceFormatVerzonden: computed ('verzonden', function(){
        try {
            return this.niceFormatDate(this.verzonden);
        }
        catch (err) {
            return 'no date';
        }
    }),

    niceFormatDate: function (date) {
        
        if (date == undefined)
            return 'undefined';
        
        let parts = (date + "").split(" ");
        return [parts[2], parts[1], parts[3]].join(" ") + ", " + this.timeHoursMinutes(parts[4]);
        
    },

    timeHoursMinutes: function(time) {
        
        let parts = time.split(":");
        return [parts[0], parts[1]].join(":");
    },

    toDays: function (d) {
        d = d || 0;
        return d / 24 / 60 / 60 / 1000;
    },

    toUTC: function (d) { 
        if(!d || !d.getFullYear)return 0; 
        return Date.UTC(d.getFullYear(), d.getMonth(),d.getDate());
    },

    daysBetween: function (d1,d2){ 
        return this.toDays(this.toUTC(d2)-this.toUTC(d1)); 
    },

    failSafeTitle: computed ('betreft', function(){
        return this.betreft == "undefined" ? "Geen title" : this.betreft;
    })

});
