import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class SitesController extends Controller {
  @service currentSession;
}
