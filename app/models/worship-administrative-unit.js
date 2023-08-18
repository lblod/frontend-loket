import { belongsTo, hasMany } from '@ember-data/model';
import BestuurseenheidModel from './bestuurseenheid';

export default class WorshipAdministrativeUnitModel extends BestuurseenheidModel {
  @belongsTo('recognized-worship-type', {
    async: true,
    inverse: null,
  })
  recognizedWorshipType;

  @hasMany('minister-position', {
    async: true,
    inverse: 'worshipService',
    polymorphic: true,
    as: 'worship-administrative-unit',
  })
  ministerPositions;
}
