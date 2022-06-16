import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class BerichtencentrumBerichtenConversatieController extends Controller {
  @service() router;

  @action
  transitionToOverview() {
    this.router.transitionTo('berichtencentrum.berichten.index');
  }
}
