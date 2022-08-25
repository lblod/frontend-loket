import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class WorshipMinistersManagementIndexController extends Controller {
  @tracked sort = 'person.gebruikte-voornaam';
  @tracked page = 0;
  @tracked size = 20;
}
