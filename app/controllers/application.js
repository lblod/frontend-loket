import Controller from '@ember/controller';
import { action } from '@ember/object';
import { equal } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default class ApplicationController extends Controller {
  @service() session;
  @service() currentSession;
  @service() router;

  @equal('router.currentRouteName', 'index') isIndex;

  @action
  logout() {
    this.session.invalidate();
  }
}
