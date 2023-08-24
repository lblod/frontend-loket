import { attr, belongsTo, hasMany } from '@ember-data/model';
import AgentInPosition from './agent-in-position';

// INHERITS FROM AGENT-IN-POSITION
export default class MandatarisModel extends AgentInPosition {
  @attr rangorde;
  @attr('datetime') start;
  @attr('datetime') einde;
  @attr('string') duplicationReason;
  @belongsTo('mandaat', { inverse: null }) bekleedt;

  @belongsTo('lidmaatschap', {
    inverse: 'lid',
    polymorphic: true,
    as: 'mandataris',
  })
  heeftLidmaatschap;

  @hasMany('rechtsgrond-aanstelling', {
    inverse: 'bekrachtigtAanstellingenVan',
    polymorphic: true,
    as: 'mandataris',
  })
  rechtsgrondenAanstelling;

  @hasMany('rechtsgrond-beeindiging', {
    inverse: 'bekrachtigtOntslagenVan',
    polymorphic: true,
    as: 'mandataris',
  })
  rechtsgrondenBeeindiging;

  @hasMany('mandataris', { inverse: null }) tijdelijkeVervangingen;
  @hasMany('beleidsdomein-code', { inverse: null }) beleidsdomein;
  @belongsTo('mandataris-status-code', { inverse: null }) status;

  @belongsTo('mandataris', { inverse: null }) duplicateOf;
  @attr('uri-set') generatedFrom;

  get generatedFromGelinktNotuleren() {
    return (this.generatedFrom || []).some(
      (uri) =>
        uri == 'http://mu.semte.ch/vocabularies/ext/mandatenExtractorService'
    );
  }

  @hasMany('contact-punt', {
    inverse: 'mandatarissen',
    polymorphic: true,
    as: 'mandataris',
  })
  contactPoints;
}

export async function getUniqueBestuursorganen(mandataris) {
  let mandate = await mandataris.bekleedt;
  let bestuursorganenInTijd = await mandate.bevatIn;

  let bestuursorganen = new Set();

  for (const bestuursorgaanInTijd of bestuursorganenInTijd.toArray()) {
    let bestuursorgaan = await bestuursorgaanInTijd.isTijdsspecialisatieVan;
    bestuursorganen.add(bestuursorgaan);
  }

  return Array.from(bestuursorganen);
}
