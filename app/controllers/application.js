import Controller from '@ember/controller';
import { service } from '@ember/service';

export default class ApplicationController extends Controller {
  @service currentSession;
  @service impersonation;
  @service session;
  @service router;

  appTitle = 'Loket voor lokale besturen';

  get isIndex() {
    return this.router.currentRouteName === 'index';
  }
}
