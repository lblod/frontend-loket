import Component from '@glimmer/component';
import { reads } from '@ember/object/computed';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MandatenbeheerMandatarisSummaryComponent extends Component {
  @reads('args.mandataris.bekleedt.bestuursfunctie.label') rol;
  @reads('args.mandataris.start') start;
  @reads('args.mandataris.einde') einde;
  @reads('args.mandataris.heeftLidmaatschap.binnenFractie.naam') fractie;
  @reads('args.mandataris.rangorde.content') rangorde;
  @reads('args.mandataris.status.label') status;
  @reads('args.mandataris.beleidsdomein') beleidsdomein;

  @tracked formattedBeleidsdomein;

  constructor() {
    super(...arguments)
    const beleidsdomein = this.beleidsdomein;
    if (beleidsdomein.length) {
      const mappedBeleidsdomein = beleidsdomein.map(item => item.label);
      this.formattedBeleidsdomein = mappedBeleidsdomein.join(', ');
    } else {
      this.formattedBeleidsdomein = [];
    }
  }

  @action
    edit(){
      this.args.onEdit();
    }

  @action
    terminate(){
      this.args.onTerminate();
    }

  @action
    correct(){
      this.args.onCorrect();
    }
}
