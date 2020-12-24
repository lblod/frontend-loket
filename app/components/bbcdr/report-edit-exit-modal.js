import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class BbcdrReportEditExitModalComponent extends Component {
  @action
    save(){
      this.onSave();
    }

  @action  
    cancel(){
      this.onCancel();
    }

  @action
    discard(){
      this.onDiscard();
    }
}

