import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class KandidatenlijstModel extends Model {
  @attr() lijstnaam;
  @attr() lijstnummer;
  @belongsTo('lijsttype', { inverse: null }) lijsttype;
  @belongsTo('rechtstreekse-verkiezing', { inverse: null })
  rechtstreekseVerkiezing;
  @hasMany('persoon', { inverse: 'isKandidaatVoor' }) kandidaten;
}
