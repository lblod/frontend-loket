import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class SharedCompactMenuComponent extends Component {
  @service() currentSession;
}
