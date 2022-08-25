import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
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

  worshipMinister;
  ministerPositionFunctions;
  originalContactAdres;

  @tracked options = this.labels;
  @tracked selected = '';
  @tracked selectedFunction;
  @tracked functionId = '';
  @tracked selectedContact;
  @tracked editingContact;

  get isEditingContactPoint() {
    return Boolean(this.editingContact);
  }

  get ministerPosition() {
    return this.worshipMinister.get('ministerPosition');
  }

  get labels() {
    return this.ministerPositionFunctions.map(({ label }) => {
      return label;
    });
  }

  getWorshipFunctionsAttributes() {
    return this.ministerPositionFunctions.map(({ id, label }) => {
      return { label, id };
    });
  }

  @action
  onCancel() {
    this.router.transitionTo('worship-ministers-management');
  }

  // fix weird behavior on edit same with new.
  // The data backend call only resolve 2 entries when the page loads (might try to call async req will solve this)

  @action
  editWorshipMinisterFunction(worshipFunction) {
    // This is creating error, I need to fix it.
    const userSelection = this.getWorshipFunctionsAttributes().find(
      ({ label }, obj) => {
        return label === worshipFunction ? obj : '';
      }
    );

    const { id } = userSelection || '';
    this.functionId = id;

    const updatedFunction = this.getWorshipFunction(this.functionId);
    this.ministerPosition.set('function', updatedFunction);

    // TODO: fix bug when leaving the route the unsaved model persists (Should not happen)
  }

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

  getWorshipFunction(worshipFunctionId) {
    return this.store.peekRecord(
      'minister-position-function',
      worshipFunctionId
    );
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
