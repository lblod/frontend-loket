import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class WorshipMinistersManagementIndexController extends Controller {
  @service currentSession;

  queryParams = ['vendorId'];

  @tracked sort = 'person.gebruikte-voornaam';
  @tracked page = 0;
  @tracked size = 20;
  @tracked vendorId = null;

  @action
  selectVendor(vendorId) {
    this.page = 0;
    this.vendorId = vendorId;
  }
}
