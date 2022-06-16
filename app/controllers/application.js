import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ApplicationController extends Controller {
  @service() session;
  @service() currentSession;
  @service() router;

  get isIndex() {
    return this.router.currentRouteName === 'index';
  }

  @action
  logout() {
    this.session.invalidate();
  }
}
