import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  uri: attr(),
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
  status: hasMany('mandataris-status-code', { inverse: null }),

  rdfaBindings: {
    class: "http://data.vlaanderen.be/ns/mandaat#Mandataris",
    rangorde: "http://data.vlaanderen.be/ns/mandaat#rangorde",
    start: "http://data.vlaanderen.be/ns/mandaat#start",
    einde: "http://data.vlaanderen.be/ns/mandaat#einde",
    bekleedt: "http://www.w3.org/ns/org#holds",
    isBestuurlijkeAliasVan: "http://data.vlaanderen.be/ns/mandaat#isBestuurlijkeAliasVan",
    heeftLidmaatschap: "http://www.w3.org/ns/org#hasMembership",
    beleidsdomein: "http://data.vlaanderen.be/ns/mandaat#beleidsdomein"
  }
});
