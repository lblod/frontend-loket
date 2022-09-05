import { attr, belongsTo, hasMany } from '@ember-data/model';
import AgentInPosition from './agent-in-position';
import { computed } from '@ember/object';

// INHERITS FROM AGENT-IN-POSITION
export default class MandatarisModel extends AgentInPosition {
  @attr rangorde;
  @attr('datetime') start;
  @attr('datetime') einde;
  @attr('string') duplicationReason;
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


  @belongsTo('mandataris', { inverse: null }) duplicateOf;
  @attr('uri-set') generatedFrom;

  @computed('generatedFrom')
  get generatedFromGelinktNotuleren() {
    return (this.generatedFrom || []).some(uri => uri == 'http://mu.semte.ch/vocabularies/ext/mandatenExtractorService');
  }

  @hasMany('contact-punt', { inverse: 'mandatarissen' }) contactPoints;

}
