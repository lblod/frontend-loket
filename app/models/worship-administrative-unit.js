import Model, { belongsTo, hasMany } from '@ember-data/model';
import BestuurseenheideModel from './bestuurseenheid';

export default class WorshipAdministrativeUnitModel extends BestuurseenheideModel {
  @belongsTo('recognized-worship-type') recognizedWorshipType;

  @hasMany('minister-position', { inverse: null }) ministerPositions;
}
