import Component from '@glimmer/component';
import { action } from '@ember/object';
import { computed } from '@ember/object';

export default class MandatenbeheerMandatarisSummaryComponent extends Component {
  get mandataris() {
    return this.args.mandataris;
  }

  get rol() {
    return this.mandataris.bekleedt.get('bestuursfunctie.label');
  }

  get start() {
    return this.mandataris.start;
  }

  get einde() {
    return this.mandataris.einde;
  }

  get fractie() {
    return this.mandataris.get('heeftLidmaatschap.binnenFractie.naam');
  }

  get rangorde() {
    return this.mandataris.get('rangorde.content');
  }

  get status() {
    return this.mandataris.get('status.label');
  }

  @computed('args.mandataris.beleidsdomein.@each.id')
    get formattedBeleidsdomein(){
      const beleidsdomeinen = this.args.mandataris.beleidsdomein;
      if (beleidsdomeinen.length) {
        return beleidsdomeinen.map(item => item.label);
      }
      else {
        return [];
      }
    }

  @action
    edit(){
      this.args.onEdit();
    }
}
