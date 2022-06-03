import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class BbcdrRapportenController extends Controller {
  @service router;
  @service currentSession;

  sort = 'status.label'; //TODO: someday we should have a hierarchy;
  page = 0;
  size = 20;

  get bestuurseenheid() {
    return this.currentSession.group;
  }

  get hasActiveChildRoute() {
    return (
      this.router.currentRouteName.startsWith('bbcdr.rapporten.') &&
      this.router.currentRouteName != 'bbcdr.rapporten.index'
    );
  }

  @action
  createNewReport() {
    if (this.router.currentRouteName == 'bbcdr.rapporten.new')
      this.router.transitionTo('bbcdr.rapporten.index');
    else this.router.transitionTo('bbcdr.rapporten.new');
  }
}
