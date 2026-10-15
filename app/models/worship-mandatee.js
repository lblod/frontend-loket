import { attr, belongsTo } from '@warp-drive/legacy/model';
import Mandataris from './mandataris';

// INHERITS FROM MANDATARIS
export default class WorshipMandateeModel extends Mandataris {
  @attr('date') expectedEndDate;
  @attr reasonStopped;

  // Harvester provenance
  @attr harvestSource;
  @attr harvestOriginalUri;
  @attr('date') harvestDate;
  @attr harvestJob;
  @attr harvestLink;

  @belongsTo('vendor', { async: true, inverse: null }) provenance;
}

export async function validateMandaat(worshipMandatee) {
  let mandate = await worshipMandatee.bekleedt;
  let isMandate = Boolean(mandate);
  if (!isMandate) {
    worshipMandatee.errors.add('bekleedt', 'mandaat is een vereist veld.');
  }
  return isMandate;
}
