import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class BerichtencentrumConversatieViewComponent extends Component {
  @service router;

  get sortedBerichten() {
    return this.args.conversatie.berichten.slice().sort(sortBySentDate);
  }
}

function sortBySentDate(berichtA, berichtB) {
  return berichtA.verzonden - berichtB.verzonden;
}
