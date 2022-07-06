import { attr, belongsTo } from '@ember-data/model';
import Mandataris from './mandataris';

// INHERITS FROM MANDATARIS
export default class WorshipMandateeModel extends Mandataris {
  @attr('date') expectedEndDate;
  @attr('string') reasonStopped;

  @belongsTo('half-election') typeHalf;
}
