import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { task } from 'ember-concurrency-decorators';
import { inject as service } from '@ember/service';

export default class EredienstMandatenbeheerMandatarisContactPointsEditController extends Controller {
  @service() store;
  @service() router;

  @tracked adres;

  @action
  updateAdres(adres) {
    this.adres = adres;
  }

  @task
  *submit() {
    const addresses = yield this.store.query('adres', {
      filter: {
        'volledig-adres': this.adres.get('volledigAdres'),
      },
    });

    let newAdres;

    if (addresses.length == 0) {
      newAdres = this.store.createRecord('adres', this.adres);
      yield newAdres.save();
    }

    this.model.adres = newAdres || addresses.firstObject;

    yield this.model.save();

    this.router.transitionTo('eredienst-mandatenbeheer.mandataris.edit');
  }

}
