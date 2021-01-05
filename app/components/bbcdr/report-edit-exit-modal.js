import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class BbcdrReportEditExitModalComponent extends Component {
  @action
    save(){
      this.args.onSave();
    }

  @action  
    cancel(){
      this.args.onCancel();
    }

  @action
    discard(){
      this.args.onDiscard();
    }
}

