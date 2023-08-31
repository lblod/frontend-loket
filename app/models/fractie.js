import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class FractieModel extends Model {
  @attr naam;
  @attr('uri-set') generatedFrom;

  @belongsTo('fractietype', {
    async: true,
    inverse: null,
  })
  fractietype;

  @hasMany('bestuursorgaan', {
    async: true,
    inverse: null,
  })
  bestuursorganenInTijd;

  @belongsTo('bestuurseenheid', {
    async: true,
    inverse: null,
  })
  bestuurseenheid;

  get generatedFromGelinktNotuleren() {
    return (this.generatedFrom || []).some(
      (uri) =>
        uri == 'http://mu.semte.ch/vocabularies/ext/mandatenExtractorService'
    );
  }
}
