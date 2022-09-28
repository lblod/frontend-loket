import { attr } from '@ember-data/model';
import Mandataris from './mandataris';

// INHERITS FROM MANDATARIS
export default class WorshipMandateeModel extends Mandataris {
  @attr('date') expectedEndDate;
  @attr reasonStopped;
}

export async function isMandaatSelected(worshipMandatee) {
  let mandate = await worshipMandatee.bekleedt;
  return Boolean(mandate);
}
