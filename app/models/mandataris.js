import { attr, belongsTo, hasMany } from '@ember-data/model';
import AgentInPosition from './agent-in-position';

// INHERITS FROM AGENT-IN-POSITION
export default class MandatarisModel extends AgentInPosition {
  @attr rangorde;
  @attr('datetime') start;
  @attr('datetime') einde;
  @attr duplicationReason;

  @belongsTo('mandaat', { async: true, inverse: null }) bekleedt;

  @belongsTo('lidmaatschap', {
    async: true,
    inverse: 'lid',
    polymorphic: true,
    as: 'mandataris',
  })
  heeftLidmaatschap;

  @hasMany('rechtsgrond-aanstelling', {
    async: true,
    inverse: 'bekrachtigtAanstellingenVan',
    polymorphic: true,
    as: 'mandataris',
  })
  rechtsgrondenAanstelling;

  @hasMany('rechtsgrond-beeindiging', {
    async: true,
    inverse: 'bekrachtigtOntslagenVan',
    polymorphic: true,
    as: 'mandataris',
  })
  rechtsgrondenBeeindiging;

  @hasMany('mandataris', {
    async: true,
    inverse: null,
  })
  tijdelijkeVervangingen;

  @hasMany('beleidsdomein-code', {
    async: true,
    inverse: null,
  })
  beleidsdomein;

  @belongsTo('mandataris-status-code', {
    async: true,
    inverse: null,
  })
  status;

  @belongsTo('mandataris', { async: true, inverse: null }) duplicateOf;

  @hasMany('contact-punt', {
    async: true,
    inverse: 'mandatarissen',
    polymorphic: true,
    as: 'mandataris',
  })
  contactPoints;

  get generatedFromGelinktNotuleren() {
    return (this.generatedFrom || []).some(
      (uri) =>
        uri == 'http://mu.semte.ch/vocabularies/ext/mandatenExtractorService'
    );
  }
}

export async function getUniqueBestuursorganen(mandataris) {
  let mandate = await mandataris.bekleedt;
  let bestuursorganenInTijd = await mandate.bevatIn;

  let bestuursorganen = new Set();

  for (const bestuursorgaanInTijd of bestuursorganenInTijd) {
    let bestuursorgaan = await bestuursorgaanInTijd.isTijdsspecialisatieVan;
    bestuursorganen.add(bestuursorgaan);
  }

  return Array.from(bestuursorganen);
}
