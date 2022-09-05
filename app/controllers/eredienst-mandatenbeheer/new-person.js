import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class EredienstMandatenbeheerNewPersonController extends Controller {
  @service() router;

  @action
  onCreate(person) {
    this.router.transitionTo('eredienst-mandatenbeheer.new', {
      queryParams: {
        personId: person.id,
      },
    });
  }

  @action
  onCancel() {
    this.router.transitionTo('eredienst-mandatenbeheer.new');
  }
}
