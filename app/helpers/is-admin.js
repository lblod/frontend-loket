import Helper from '@ember/component/helper';
import { service } from '@ember/service';

export default class isAdmin extends Helper {
  @service currentSession;

  compute() {
    return this.currentSession.isAdmin;
  }
}
