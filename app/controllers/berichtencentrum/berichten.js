import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class BerichtencentrumBerichtenController extends Controller {
  @service() router;

  sort = '-laatste-bericht.verzonden';
  page = 0;
  size = 20;

  @tracked preferences = false;
  @tracked bestuurseenheid;

  get hasActiveChildRoute(){
    return this.router.currentRouteName.startsWith('berichtencentrum.berichten.')
        && this.router.currentRouteName != 'berichtencentrum.berichten.index';
  }

  @action
    showPreferences() {
      this.showPreferences = true;
    }

  @action
    hidePreferences() {
      this.showPreferences = false;
    }
}

