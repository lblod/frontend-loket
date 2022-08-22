import Component from '@glimmer/component';
import { DOCUMENT_STATUS } from 'frontend-loket/utils/constants';

export default class Status extends Component {
  get label() {
    return DOCUMENT_STATUS[this.args.uri]?.label;
  }
  get statusSkin() {
    return DOCUMENT_STATUS[this.args.uri]?.skin;
  }
}
