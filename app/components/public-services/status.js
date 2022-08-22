import Component from '@glimmer/component';
import { LIFECYCLE_STATUS, LABEL } from 'frontend-loket/utils/constants';

const PUBLICATION_STATUS_SKIN = {
  [LIFECYCLE_STATUS.ACTIVE]: 'success',
  [LIFECYCLE_STATUS.NOT_ACTIVE]: 'error',
  [LIFECYCLE_STATUS.CONCEPT]: 'warning',
};

export default class Status extends Component {
  get label() {
    return LABEL[this.args.uri];
  }
  get statusSkin() {
    return PUBLICATION_STATUS_SKIN[this.args.uri];
  }
}
