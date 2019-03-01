import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';
import { computed } from '@ember/object';


export default Model.extend({
  naam: attr(),
  fractietype: belongsTo('fractietype', { inverse: null }),
  bestuursorganenInTijd: hasMany('bestuursorgaan', { inverse: null }),
  bestuurseenheid: belongsTo('bestuurseenheid', { inverse: null }),
  generatedFrom: attr('uri-set'),

  generatedFromGelinktNotuleren: computed('generatedFrom', function(){
    return (this.generatedFrom || []).some(uri => uri == 'http://mu.semte.ch/vocabularies/ext/mandatenExtractorService');
  })
});
