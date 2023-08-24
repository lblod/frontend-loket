import { belongsTo, hasMany } from '@ember-data/model';
import BestuurseenheidModel from './bestuurseenheid';

export default class WorshipAdministrativeUnitModel extends BestuurseenheidModel {
  @belongsTo('recognized-worship-type', { inverse: null })
  recognizedWorshipType;

  @hasMany('minister-position', {
    inverse: 'worshipService',
    polymorphic: true,
    as: 'worship-administrative-unit',
  })
  ministerPositions;
}
