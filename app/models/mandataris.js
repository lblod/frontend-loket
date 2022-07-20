import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class MandatarisModel extends Model {
  @attr('string') rangorde;
  @attr('datetime') start;
  @attr('datetime') einde;
  @belongsTo('mandaat', { inverse: null }) bekleedt;
  @belongsTo('lidmaatschap', { inverse: 'lid' }) heeftLidmaatschap;
  @belongsTo('persoon', { inverse: 'isAangesteldAls' }) isBestuurlijkeAliasVan;
  @hasMany('rechtsgrond-aanstelling', {
    inverse: 'bekrachtigtAanstellingenVan',
  })
  rechtsgrondenAanstelling;
  @hasMany('rechtsgrond-beeindiging', { inverse: 'bekrachtigtOntslagenVan' })
  rechtsgrondenBeeindiging;
  @hasMany('mandataris', { inverse: null }) tijdelijkeVervangingen;
  @hasMany('beleidsdomein-code', { inverse: null }) beleidsdomein;
  @belongsTo('mandataris-status-code', { inverse: null }) status;
}
