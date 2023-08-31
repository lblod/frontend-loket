import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class MandatenbeheerMandatarisTableComponent extends Component {
  @service router;

  @action
  async removeMandataris(mandataris) {
    await mandataris.destroyRecord();

    this.router.refresh('mandatenbeheer.mandatarissen');
  }
}
