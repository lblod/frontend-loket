import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { restartableTask, timeout } from 'ember-concurrency';

export default class EredienstMandatenbeheerMandatarissenController extends Controller {
  @service() router;

  sort = 'is-bestuurlijke-alias-van.gebruikte-voornaam';

  @tracked mandatenbeheer;
  @tracked filter = '';
  @tracked page = 0;
  @tracked size = 10;

  get startDate() {
    return this.mandatenbeheer.startDate;
  }

  get bestuursperioden() {
    return this.mandatenbeheer.bestuursperioden;
  }

  get bestuurseenheid() {
    return this.mandatenbeheer.bestuurseenheid;
  }

  get bestuursorganen() {
    return this.mandatenbeheer.bestuursorganen;
  }

  @restartableTask
  *search(searchData) {
    yield timeout(300);
    this.page = 0;
    this.filter = searchData;
  }

  @action
  selectPeriod(startDate) {
    this.router.transitionTo('eredienst-mandatenbeheer.mandatarissen', {
      queryParams: {
        page: 0,
        startDate: startDate,
      },
    });
  }
}
