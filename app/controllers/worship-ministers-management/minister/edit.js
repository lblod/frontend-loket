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
import { combineFullAddress, isValidAdres } from 'frontend-loket/models/adres';

export default class WorshipMinistersManagementMinisterEditController extends Controller {
  @service store;
  @service router;

  @tracked selectedContact;
  @tracked editingContact;
  @tracked isManualAddress;

  originalContactAdres;

  get isEditingContactPoint() {
    return Boolean(this.editingContact);
  }

  @action
  handleFunctieChange(functie) {
    const { minister } = this.model;
    minister.ministerPosition = functie;
    minister.errors.remove('ministerPosition');
  }

  @action
  handleDateChange(attributeName, isoDate, date) {
    const { minister } = this.model;
    minister[attributeName] = date;
    let { agentStartDate, agentEndDate } = minister;
    if (agentEndDate instanceof Date && agentStartDate instanceof Date) {
      if (agentEndDate <= agentStartDate) {
        minister.errors.add(
          'agentEndDate',
          'De einddatum moet na de startdatum liggen',
        );
      } else {
        minister.errors.remove('agentEndDate');
      }
    }
  }

  @action
  handleContactSelectionChange(contact, isSelected) {
    if (isSelected) {
      this.model.minister.errors.remove('contacts');
      this.selectedContact = contact;
    } else {
      this.selectedContact = null;
    }
  }

  @action
  async toggleInputMode() {
    this.isManualAddress = !this.isManualAddress;

    let currentAddress = await this.editingContact.adres;
    if (currentAddress) {
      currentAddress.rollbackAttributes();
      this.editingContact.adres = null;
    }

    if (this.isManualAddress) {
      // Updating a relationship value doesn't seem to clear the corresponding error messages, so we do it manually
      this.editingContact.errors.remove('adres');

      this.editingContact.adres = this.store.createRecord('adres');
    }
  }

  @action
  addNewContact() {
    this.isManualAddress = false;
    this.model.minister.errors.remove('contacts');

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
    if (!this.originalContactAdres.adresRegisterUri) {
      this.isManualAddress = true;
    } else {
      this.isManualAddress = false;
    }
  }

  @action
  async handleEditContactCancel() {
    this.rollbackUnsavedContactChanges();
  }

  @dropTask
  *save() {
    let { minister, contacts } = this.model;
    minister.errors.remove('contacts');

    if (!minister.agentStartDate) {
      minister.errors.add('agentStartDate', 'startdatum is een vereist veld.');
    }

    yield validateFunctie(minister);

    if (this.isEditingContactPoint) {
      let contactPoint = this.editingContact;
      let secondaryContactPoint = yield contactPoint.secondaryContactPoint;
      let adres = yield contactPoint.adres;

      // the user is using input mode manual, we trigger error messages here.
      if (this.isManualAddress) {
        yield isValidAdres(adres);
      }

      if (
        (yield isValidPrimaryContact(contactPoint)) &&
        minister.isValid &&
        adres.isValid
      ) {
        if (secondaryContactPoint.telefoon) {
          yield secondaryContactPoint.save();
        } else {
          // Ember Data v4.7+ doesn't remove the record from the relationship when we call destroyRecord, so we do it manually for now
          // More info: https://github.com/emberjs/data/issues/8792
          contactPoint.secondaryContactPoint = null;

          // The secondary contact point is empty so we can remove it if it was ever persisted before
          yield secondaryContactPoint.destroyRecord();
        }

        if (adres?.isNew || adres?.hasDirtyAttributes) {
          adres.volledigAdres = combineFullAddress(adres);
          yield adres.save();
        }

        if (contactPoint.isNew) {
          // If we are adding a new contact point, it will always be the "selected" contact after it is saved
          this.selectedContact = contactPoint;
        }

        yield contactPoint.save();
      } else {
        return;
      }
    }

    if (this.selectedContact) {
      let primaryContactPoint = findPrimaryContactPoint(
        yield minister.contacts,
      );

      if (this.selectedContact.id !== primaryContactPoint?.id) {
        let secondaryContact = yield this.selectedContact.secondaryContactPoint;

        minister.contacts = [this.selectedContact, secondaryContact].filter(
          Boolean,
        );
      }
    } else {
      // TODO: This works around a problem in Ember Data where adding an error without the record being in a dirty state triggers an exception.
      // Ember Data doesn't consider relationship changes a "dirty" change, so this causes issues if the adres is cleared.
      // This workaround uses `.send` but that is a private API which is no longer present in Ember Data 4.x
      // The bug is fixed in Ember Data 4.6 so we need to update to that version instead of 4.4 LTS
      // More information in the Discord: https://discord.com/channels/480462759797063690/1016327513900847134
      // Same old issue where they use this workaround: https://stackoverflow.com/questions/27698496/attempted-to-handle-event-becameinvalid-while-in-state-root-loaded-saved
      minister.send?.('becomeDirty');
      minister.errors.add(
        'contacts',
        `Klik op "Contactgegevens toevoegen" om contactgegevens in te vullen${
          contacts.length > 0
            ? ' of selecteer een van de bestaande contactgegevens.'
            : '.'
        }`,
      );
      return;
    }

    if (
      this.selectedContact.isValid &&
      minister.isValid &&
      minister.contacts.length > 0
    ) {
      yield minister.save();

      try {
        yield this.router.transitionTo('worship-ministers-management');
      } catch {
        // I believe we're running into this issue: https://github.com/emberjs/ember.js/issues/20038
        // A `TransitionAborted` error is thrown even though the transition is complete, so we hide the error.
      }
    }
  }

  rollbackUnsavedChanges() {
    this.model.minister.rollbackAttributes();
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

      // Ember Data v4.7+ throws an error if we don't empty out the relationship before calling rollbackAttributes
      // More info: https://github.com/emberjs/data/issues/8792
      contactPoint.secondaryContactPoint = null;
      contactPoint.rollbackAttributes();

      this.editingContact = null;
    }
  }
}
