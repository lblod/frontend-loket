import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  rangorde: attr('language-string'),
  start: attr('datetime'),
  einde: attr('datetime'),
  bekleedt: belongsTo('mandaat', { inverse: null }),
  heeftLidmaatschap: belongsTo('lidmaatschap', { inverse: 'lid' }),
  isBestuurlijkeAliasVan: belongsTo('persoon', { inverse: 'isAangesteldAls' }),
  rechtsgrondenAanstelling: hasMany('rechtsgrond-aanstelling', { inverse: 'bekrachtigtAanstellingenVan' }),
  rechtsgrondenBeeindiging: hasMany('rechtsgrond-beeindiging', { inverse: 'bekrachtigtOntslagenVan' }),
  tijdelijkeVervangingen: hasMany('mandataris', { inverse: null }),
  beleidsdomein: hasMany('beleidsdomein-code', { inverse: null }),
  status: hasMany('mandataris-status-code', { inverse: null })
});
