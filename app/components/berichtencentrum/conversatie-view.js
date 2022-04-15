import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { sort } from '@ember/object/computed';

export default class BerichtencentrumConversatieViewComponent extends Component {
  @service() router;

  @sort('berichten', 'generalSort') sortedBerichten;

  @tracked generalSort = ['verzonden'];
  @tracked showExitModal = false;

  get berichten() {
    return this.args.model.berichten;
  }
}
