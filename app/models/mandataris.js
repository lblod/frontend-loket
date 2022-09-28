import { attr, belongsTo, hasMany } from '@ember-data/model';
import AgentInPosition from './agent-in-position';

// INHERITS FROM AGENT-IN-POSITION
export default class MandatarisModel extends AgentInPosition {
  @attr rangorde;
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
  @hasMany('contact-punt', { inverse: 'mandatarissen' }) contactPoints;
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
