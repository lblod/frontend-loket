import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class EredienstMandatenbeheerNewPersonController extends Controller {
  @service() router;

  queryParams = ['firstName', 'lastName', 'rijksregisternummer'];
  @tracked firstName = '';
  @tracked lastName = '';
  @tracked rijksregisternummer = '';

  get personPrefilledValues() {
    return {
      voornaam: this.firstName,
      familienaam: this.lastName,
      rijksregisternummer: this.rijksregisternummer,
    };
  }

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
