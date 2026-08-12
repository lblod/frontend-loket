import { belongsTo, hasMany } from '@warp-drive/legacy/model';
import BestuurseenheidModel from './bestuurseenheid';

export default class WorshipAdministrativeUnitModel extends BestuurseenheidModel {
  @belongsTo('recognized-worship-type', {
    async: true,
    inverse: null,
  })
  recognizedWorshipType;

  @belongsTo('organization-status-code', {
    async: true,
    inverse: null,
  })
  organizationStatus;

  @hasMany('minister-position', {
    async: true,
    inverse: 'worshipService',
    polymorphic: true,
    as: 'worship-administrative-unit',
  })
  ministerPositions;
}
