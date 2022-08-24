import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { dropTask } from 'ember-concurrency';
import {
  createPrimaryContactPoint,
  createSecondaryContactPoint,
  findPrimaryContactPoint,
} from 'frontend-loket/models/contact-punt';

export default class WorshipMinistersManagementMinisterEditController extends Controller {
  @service currentSession;
  @service store;
  @service router;

  bedienaar;
  ministerPositionFunctions;

  @tracked function = '';
  @tracked options = A(this.getWorshipFunctionsLabels());
  @tracked selected = '';

  getWorshipFunctionsLabels() {
    return this.ministerPositionFunctions.map((a) => {
      return a.label;
    });
  }

  @action
  setWorshipMinister(minister) {
    this.model.persoon = minister;
  }

  @action
  onCancel() {
    this.router.transitionTo('worship-ministers-management');
  }

  @action
  setWorshipMinisterFunction(worshipFunction) {}

  @action
  handleDateChange(attributeName, isoDate, date) {
    this.model[attributeName] = date;
  }

  @action
  handleContactSelectionChange(contact, isSelected) {
    if (isSelected) {
      this.selectedContact = contact;
    } else {
      this.selectedContact = null;
    }
  }

  @action
  addNewContact() {
    let primaryContactPoint = createPrimaryContactPoint(this.store);
    let secondaryContactPoint = createSecondaryContactPoint(this.store);

    primaryContactPoint.secondaryContactPoint = secondaryContactPoint;
    this.editingContact = primaryContactPoint;
  }

  @action
  async setEditingContact(contactPoint) {
    let secondaryContactPoint = await contactPoint.secondaryContactPoint;

    if (!secondaryContactPoint) {
      secondaryContactPoint = createSecondaryContactPoint(this.store);

      contactPoint.secondaryContactPoint = secondaryContactPoint;
    }

    this.originalContactAdres = await contactPoint.adres;
    this.editingContact = contactPoint;
  }

  @action
  async handleEditContactCancel() {
    this.rollbackUnsavedContactChanges();
  }

  @dropTask
  *save() {
    if (this.isEditingContactPoint) {
      let contactPoint = this.editingContact;
      let secondaryContactPoint = yield contactPoint.secondaryContactPoint;
      let adres = yield contactPoint.adres;

      if (contactPoint.telefoon || contactPoint.email || adres) {
        if (secondaryContactPoint.telefoon) {
          yield secondaryContactPoint.save();
        } else {
          // The secondary contact point is empty so we can remove it if it was ever persisted before
          yield secondaryContactPoint.destroyRecord();
        }

        if (adres?.isNew) {
          yield adres.save();
        }

        if (contactPoint.isNew) {
          // If we are adding a new contact point, it will always be the "selected" contact after it is saved
          this.selectedContact = contactPoint;
        }

        yield contactPoint.save();
      } else {
        // We set generic error flags so we can display the real message in the template.
        // Once any of these properties receive a new value the message will disappear since only 1 value is required.
        contactPoint.errors.add('adres', 'ERROR');
        contactPoint.errors.add('email', 'ERROR');
        contactPoint.errors.add('telefoon', 'ERROR');
        return;
      }
    }

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

    try {
      yield this.router.transitionTo('worship-ministers-management');
    } catch (error) {
      // I believe we're running into this issue: https://github.com/emberjs/ember.js/issues/20038
      // A `TransitionAborted` error is thrown even though the transition is complete, so we hide the error.
    }
  }

  rollbackUnsavedChanges() {
    this.rollbackUnsavedContactChanges();
    this.model.rollbackAttributes();
  }

  async rollbackUnsavedContactChanges() {
    if (this.isEditingContactPoint) {
      let contactPoint = this.editingContact;
      let secondaryContactPoint = await contactPoint.secondaryContactPoint;

      let currentAdres = await contactPoint.adres;
      if (currentAdres?.isNew) {
        currentAdres.rollbackAttributes();
      }

      if (this.originalContactAdres) {
        contactPoint.adres = this.originalContactAdres;
        this.originalContactAdres = null;
      }

      secondaryContactPoint?.rollbackAttributes?.();
      contactPoint.rollbackAttributes();

      this.editingContact = null;
    }
  }
}