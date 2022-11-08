import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { dropTask } from 'ember-concurrency';
import {
  createPrimaryContactPoint,
  createSecondaryContactPoint,
  findPrimaryContactPoint,
  isValidPrimaryContact,
} from 'frontend-loket/models/contact-punt';
import { validateFunctie } from 'frontend-loket/models/minister';

export default class WorshipMinistersManagementNewController extends Controller {
  @service router;
  @service store;

  queryParams = ['personId'];

  @tracked personId = '';
  @tracked selectedContact;
  @tracked editingContact;

  originalContactAdres;

  get hasContact() {
    return this.model?.contacts?.length > 0;
  }

  get isEditingContactPoint() {
    return Boolean(this.editingContact);
  }

  get shouldSelectPerson() {
    return !this.model?.person;
  }

  @action
  selectPersoon(persoon) {
    this.router.transitionTo({ queryParams: { personId: persoon.id } });
  }

  @action
  createNewPerson(hasData) {
    hasData
      ? this.router.transitionTo('worship-ministers-management.new-person', {
          queryParams: hasData,
        })
      : this.router.transitionTo('worship-ministers-management.new-person');
  }

  @action
  async handleDateChange(type, isoDate, date) {
    const { worshipMinister } = this.model;
    worshipMinister[type] = date;
    let { agentStartDate, agentEndDate } = worshipMinister;
    if (agentEndDate instanceof Date && agentStartDate instanceof Date) {
      if (agentEndDate <= agentStartDate) {
        worshipMinister.errors.add(
          'agentEndDate',
          'De einddatum moet na de startdatum liggen'
        );
      } else {
        worshipMinister.errors.remove('agentEndDate');
      }
    }
  }

  @action
  handleFunctieChange(functie) {
    const { worshipMinister } = this.model;
    worshipMinister.ministerPosition = functie;
    worshipMinister.errors.remove('ministerPosition');
  }

  @action
  cancel() {
    this.router.transitionTo('worship-ministers-management');
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
  *createWorshipMinister(event) {
    event.preventDefault();

    let { worshipMinister, contacts } = this.model;

    // validate the minister record
    if (!worshipMinister.agentStartDate) {
      worshipMinister.errors.add(
        'agentStartDate',
        'startdatum is een vereist veld.'
      );
    }
    yield validateFunctie(worshipMinister);

    // validate the worship minister contacts which has 2 valid branches:
    // the user is editing a new contact:
    if (this.isEditingContactPoint) {
      let contactPoint = this.editingContact;
      let secondaryContactPoint = yield contactPoint.secondaryContactPoint;
      let adres = yield contactPoint.adres;

      // in this case the contact point information and address should be valid
      if (
        yield isValidPrimaryContact(contactPoint) && worshipMinister.isValid
      ) {
        if (adres?.isNew) {
          yield adres.save();
        }

        if (contactPoint.isNew) {
          // If we are adding a new contact point, it will always be the "selected" contact after it is saved
          this.selectedContact = contactPoint;
        }

        if (secondaryContactPoint.telefoon) {
          yield secondaryContactPoint.save();
        }
      } else {
        return;
      }
    }

    // the user has selected an already existing contact pair
    if (this.selectedContact) {
      let primaryContactPoint = findPrimaryContactPoint(contacts);

      if (this.selectedContact.id !== primaryContactPoint?.id) {
        let secondaryContact = yield this.selectedContact.secondaryContactPoint;
        worshipMinister.contacts = [
          this.selectedContact,
          secondaryContact,
        ].filter(Boolean);
      }
    }

    // if both the minister record and contacts are valid we can start saving everything
    if (
      worshipMinister.isValid &&
      worshipMinister.contacts.length > 0 &&
      this.selectedContact.isValid
    ) {
      let secondaryContactPoint = yield this.selectedContact
        .secondaryContactPoint;
      if (secondaryContactPoint !== null) {
        if (!secondaryContactPoint.telefoon) {
          // The secondary contact point is empty so we can remove it if it was ever persisted before
          yield secondaryContactPoint.destroyRecord();
        }
      }
      yield this.selectedContact.save();
      yield worshipMinister.save();
      this.router.transitionTo('worship-ministers-management');
    } else {
      return;
    }
  }

  rollbackUnsavedChanges() {
    this.model?.worshipMinister?.rollbackAttributes();
    this.rollbackUnsavedContactChanges();
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
