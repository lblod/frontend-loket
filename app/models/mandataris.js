import { attr, belongsTo } from '@ember-data/model';
import AgentInPosition from './agent-in-position';

// INHERITS FROM AGENT-IN-POSITION
export default class MandatarisModel extends AgentInPosition {
  @attr('datetime') start;
  @attr('datetime') einde;

  @belongsTo('mandaat', { async: true, inverse: null }) bekleedt;

  @belongsTo('mandataris-status-code', {
    async: true,
    inverse: null,
  })
  status;
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
