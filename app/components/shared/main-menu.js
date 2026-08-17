import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class SharedMainMenuComponent extends Component {
  @service() currentSession;
}
