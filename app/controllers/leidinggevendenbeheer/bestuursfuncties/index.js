import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object'
import { tracked } from '@glimmer/tracking';

export default class LeidinggevendenbeheerBestuursfunctiesIndexController extends Controller {
  @service() router;

  page = 0;
  size = 20;

  @tracked allowed;
  @tracked bestuurseenheid;

  @action
    displayBestuursfunctie(bestuursfunctie) {
      this.router.transitionTo('leidinggevendenbeheer.bestuursfuncties.bestuursfunctie.functionarissen', bestuursfunctie.id);
    }
}
