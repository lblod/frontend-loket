import { attr } from '@ember-data/model';
import Mandataris from './mandataris';

// INHERITS FROM MANDATARIS
export default class WorshipMandateeModel extends Mandataris {
  @attr('date') expectedEndDate;
  @attr reasonStopped;
}

export async function isMandaatValid(worshipMandatee) {
  let mandate = await worshipMandatee.bekleedt;
  if (!mandate) {
    worshipMandatee.errors.add('bekleedt', 'mandaat is een vereist veld.');
  } else {
    return mandate.isValid;
  }
}
