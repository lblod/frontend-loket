import Component from '@glimmer/component';
import { restartableTask } from 'ember-concurrency';

export default class TrimInputComponent extends Component {
  @restartableTask
  *trimInput(event) {
    const input = yield event.target.value;
    this.args.onUpdate(input.trim());
  }
}
