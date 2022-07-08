import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';
import { inject as service } from '@ember/service';

export default class EredienstMandatenbeheerMandatarisContactPointsEditController extends Controller {
  @service() store;
  @service() router;

  @tracked adres;

  @task
  *updateAdres(adres) {
    this.adres = yield adres;
  }

  @task
  *submit() {
    yield this.adres;
    const addresses = yield this.store.query('adres', {
      filter: {
        'volledig-adres': this.adres.volledigAdres,
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
