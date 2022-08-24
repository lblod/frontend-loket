import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class WorshipMinistersManagementIndexController extends Controller {
  @service router;
  @service store;

  sort = 'person.gebruikte-voornaam';
  @tracked page = 0;
  @tracked size = 20;

  @action
  addNewMinister() {
    this.router.transitionTo('worship-ministers-management.new');
  }
}
