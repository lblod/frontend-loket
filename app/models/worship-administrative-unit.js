import { belongsTo, hasMany } from '@ember-data/model';
import BestuurseenheidModel from './bestuurseenheid';

export default class WorshipAdministrativeUnitModel extends BestuurseenheidModel {
  @belongsTo('recognized-worship-type') recognizedWorshipType;

  @hasMany('minister-position', { inverse: null }) ministerPositions;
}
