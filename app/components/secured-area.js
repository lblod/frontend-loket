import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class SecuredAreaComponent extends Component {
  @service currentSession;

  get canEdit() {
    return this.currentSession.canEdit;
  }
  get canOnlyRead() {
    return this.currentSession.canOnlyRead;
  }
}
