import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class MandatenbeheerMandatarisEditPromptComponent extends Component {
  @action 
    terminate(){
      this.args.onTerminate();
    }

  @action
    correct(){
      this.args.onCorrect();
    }
}
