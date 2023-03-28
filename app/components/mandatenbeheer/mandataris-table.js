import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class MandatenbeheerMandatarisTableComponent extends Component {
  @action
  async removeMandataris(mandataris) {
    await mandataris.destroyRecord();
    const count = this.args.content.meta.count - 1;
    this.args.content.set('meta.count', count);
  }
}
