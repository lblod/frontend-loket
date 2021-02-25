import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class BbcdrReportEditHeaderComponent extends Component {
  @action
    close(){
      this.onClose();
    }
}

