import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class UserInfo extends Component {
  @service currentSession;
  @service impersonation;

  get user() {
    if (this.impersonation.isImpersonating) {
      return this.impersonation.originalAccount.gebruiker;
    } else {
      return this.currentSession.user;
    }
  }

  <template>{{yield this.user}}</template>
}
