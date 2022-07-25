import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { dropTask } from 'ember-concurrency';
import { findPrimaryContactPoint } from 'frontend-loket/models/contact-punt';

export default class EredienstMandatenbeheerMandatarisEditController extends Controller {
  @service currentSession;
  @service store;
  @service router;

  @tracked selectedContact;

  @action
  setMandaat(mandaat) {
    this.model.bekleedt = mandaat;
  }

  @action
  handleDateChange(attributeName, isoDate, date) {
    this.model[attributeName] = date;
  }

  @action
  handleContactChange(contact, isSelected) {
    if (isSelected) {
      this.selectedContact = contact;
    } else {
      this.selectedContact = null;
    }
  }

  @dropTask
  *save() {
    if (this.selectedContact) {
      let primaryContactPoint = findPrimaryContactPoint(
        yield this.model.contacts
      );

      if (this.selectedContact.id !== primaryContactPoint?.id) {
        let secondaryContact = yield this.selectedContact.secondaryContactPoint;

        this.model.contacts = [this.selectedContact, secondaryContact].filter(
          Boolean
        );
      }
    } else {
      this.model.contacts = [];
    }

    yield this.model.save();
  }
}
