import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';

export default class EredienstMandatenbeheerMandatarisContactPointsEditController extends Controller {
  @service store;
  @service router;

  @tracked adres;

  @task
  *submit() {
    if (this.adres) {
      const addresses = yield this.store.query('adres', {
        filter: {
          'adres-register-uri': this.adres.adresRegisterUri,
        },
      });

      let newAdres;

      if (addresses.length == 0) {
        newAdres = this.store.createRecord('adres', this.adres);
        yield newAdres.save();
      }

      this.model.adres = newAdres || addresses.firstObject;
    } else {
      this.model.adres = null;
    }

    yield this.model.save();
    yield this.router.transitionTo('eredienst-mandatenbeheer.mandataris.edit');
  }
}
