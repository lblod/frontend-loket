import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
export default class WorshipMinistersManagementNewPersonController extends Controller {
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
    this.router.transitionTo('worship-ministers-management.new', {
      queryParams: {
        personId: person.id,
      },
    });
  }

  @action
  onCancel() {
    this.router.transitionTo('worship-ministers-management.new');
  }
}
