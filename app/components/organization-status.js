import Component from '@glimmer/component';
import { ORGANIZATION_STATUS } from '../models/organization-status-code';

const ORGANIZATION_STATUS_SKINS = {
  [ORGANIZATION_STATUS.ACTIVE]: 'success',
  [ORGANIZATION_STATUS.IN_FORMATION]: 'warning',
  [ORGANIZATION_STATUS.INACTIVE]: 'error',
};

export default class OrganizationStatusComponent extends Component {
  get statusSkin() {
    return ORGANIZATION_STATUS_SKINS[this.args.id];
  }
}
