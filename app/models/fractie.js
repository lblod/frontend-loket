import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { computed } from '@ember/object';

export default class FractieModel extends Model {
  @attr naam;
  @belongsTo('fractietype', { inverse: null }) fractietype;
  @hasMany('bestuursorgaan', { inverse: null }) bestuursorganenInTijd;
  @belongsTo('bestuurseenheid', { inverse: null }) bestuurseenheid;
  @attr('uri-set') generatedFrom;
  @computed('generatedFrom')
  get generatedFromGelinktNotuleren() {
    return (this.generatedFrom || []).some(uri => uri == 'http://mu.semte.ch/vocabularies/ext/mandatenExtractorService');
  }
}
