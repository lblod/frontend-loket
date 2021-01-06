import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class BerichtencentrumConversatieViewComponent extends Component {
  @service() router;

  @tracked showExitModal = false;
  
  get berichten(){
    return this.args.model.berichten
  } 
}
