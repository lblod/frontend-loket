import { attr, belongsTo } from '@ember-data/model';
import Mandataris from './mandataris';

// INHERITS FROM MANDATARIS
export default class WorshipMandateeModel extends Mandataris {
  @attr('date') expectedEndDate;
  @attr reasonStopped;

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
