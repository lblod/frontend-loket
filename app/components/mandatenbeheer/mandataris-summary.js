/* eslint-disable ember/no-computed-properties-in-native-classes */
import Component from '@glimmer/component';
import { reads } from '@ember/object/computed';
import { action } from '@ember/object';

export default class MandatenbeheerMandatarisSummaryComponent extends Component {
  @reads('args.mandataris.bekleedt.bestuursfunctie.label') rol;
  @reads('args.mandataris.start') start;
  @reads('args.mandataris.einde') einde;
  @reads('args.mandataris.heeftLidmaatschap.binnenFractie.naam') fractie;
  @reads('args.mandataris.rangorde') rangorde;
  @reads('args.mandataris.status.label') status;
  @reads('args.mandataris.generatedFromGelinktNotuleren') gelinktNotuleren;

  get formattedBeleidsdomein() {
    const beleidsdomeinen = this.args.mandataris.hasMany('beleidsdomein').value();
    if (beleidsdomeinen?.length) {
      return beleidsdomeinen.map((item) => item.label).join(', ');
    } else {
      return '';
    }
  }

  @action
  edit() {
    this.args.onEdit();
  }

  @action
  terminate() {
    this.args.onTerminate();
  }

  @action
  correct() {
    this.args.onCorrect();
  }
}
