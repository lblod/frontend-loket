import { attr } from '@ember-data/model';
import Mandataris from './mandataris';

// INHERITS FROM MANDATARIS
export default class WorshipMandateeModel extends Mandataris {
  @attr('date') expectedEndDate;
  @attr reasonStopped;
}

export async function validateMandaat(worshipMandatee) {
  let mandate = await worshipMandatee.bekleedt;
  let isMandate = Boolean(mandate);
  if (!isMandate) {
    worshipMandatee.errors.add('bekleedt', 'mandaat is een vereist veld.');
  }
  return isMandate;
}
