import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';
import { inject as service } from '@ember/service';
import { CONTACT_TYPE } from 'frontend-loket/models/contact-punt';

export default class EredienstMandatenbeheerMandatarisContactPointsNewController extends Controller {
  @service store;
  @service router;

  @tracked adres;
  @tracked telephone;
  @tracked secondaryTelephone;
  @tracked email;
  @tracked hasError = false;

  get hasPrimaryContactPointData() {
    return this.adres || this.telephone || this.email;
  }

  get showErrorMessage() {
    return this.hasError && !this.hasPrimaryContactPointData;
  }

  @task
  *submit() {
    if (this.hasPrimaryContactPointData) {
      const contactPoint = this.store.createRecord('contact-punt', {
        type: CONTACT_TYPE.PRIMARY,
        email: this.email,
        telefoon: this.telephone,
        mandataris: this.model,
      });

      if (this.adres) {
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

        contactPoint.adres = newAdres || addresses.firstObject;
      }

      if (this.secondaryTelephone) {
        let secondaryContactPoint = this.store.createRecord('contact-punt', {
          type: CONTACT_TYPE.SECONDARY,
          telefoon: this.secondaryTelephone,
        });

        yield secondaryContactPoint.save();
        contactPoint.secondaryContactPoint = secondaryContactPoint;
      }

      yield contactPoint.save();

      // TODO: This needs to be saved somehow, but saving now would also persist any unsaved changes
      // on the mandataris edit page which might not be what we want here.
      // If we don't save here the contacts will still be created, but they won't be linked to the position if the user doesn't save on the edit page.
      let mandataris = this.model;
      mandataris.contacts = [
        contactPoint,
        yield contactPoint.secondaryContactPoint,
      ].filter(Boolean);

      yield this.router.transitionTo(
        'eredienst-mandatenbeheer.mandataris.edit'
      );
    } else {
      this.hasError = true;
    }
  }
}
