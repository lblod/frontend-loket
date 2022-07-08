import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { task } from 'ember-concurrency-decorators';
import { inject as service } from '@ember/service';

export default class EredienstMandatenbeheerMandatarisContactPointsNewController extends Controller {
  @service() store;
  @service() router;

  @tracked adres;
  @tracked telephone;
  @tracked email;

  @action
  updateAdres(adres) {
    this.adres = adres;
  }

  @task
  *submit() {
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

    const contactPoint = this.store.createRecord('contact-punt', {
      email: this.email,
      telefoon: this.telephone,
      adres: newAdres || addresses.firstObject,
      mandataris: this.model,
    });

    yield contactPoint.save();

    this.router.transitionTo('eredienst-mandatenbeheer.mandataris.edit');
  }
}