import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class SharedSideMenuComponent extends Component {
  @service() currentSession;
}
