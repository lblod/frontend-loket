import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { dropTask } from 'ember-concurrency';
import {
  createPrimaryContactPoint,
  createSecondaryContactPoint,
  findPrimaryContactPoint,
  isValidPrimaryContact,
} from 'frontend-loket/models/contact-punt';
import { setExpectedEndDate } from 'frontend-loket/utils/eredienst-mandatenbeheer';
import { validateMandaat } from 'frontend-loket/models/worship-mandatee';
import { combineFullAddress, isValidAdres } from 'frontend-loket/models/adres';
export default class EredienstMandatenbeheerMandatarisEditController extends Controller {
  @service currentSession;
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
  setMandaat(mandaat) {
    this.model.bekleedt = mandaat;
    setExpectedEndDate(this.store, this.model, mandaat);
  }

  @action
  handleDateChange(attributeName, isoDate, date) {
    this.model[attributeName] = date;
    let { start, einde } = this.model;
    if (einde instanceof Date && start instanceof Date) {
      if (einde <= start) {
        this.model.errors.add(
          'einde',
          'De einddatum moet na de startdatum liggen'
        );
      } else {
        this.model.errors.remove('einde');
      }
    }
  }

  @action
  handleContactSelectionChange(contact, isSelected) {
    if (isSelected) {
      this.model.errors.remove('contacts');
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
    this.model.errors.remove('contacts');

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
    this.model.errors.remove('contacts');
    if (!this.model.start) {
      this.model.errors.add('start', 'startdatum is een vereist veld.');
    }

    yield validateMandaat(this.model);

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
        this.model.isValid &&
        adres.isValid
      ) {
        if (secondaryContactPoint.telefoon) {
          yield secondaryContactPoint.save();
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
        yield this.model.contacts
      );

      if (this.selectedContact.id !== primaryContactPoint?.id) {
        let secondaryContact = yield this.selectedContact.secondaryContactPoint;

        this.model.contacts = [this.selectedContact, secondaryContact].filter(
          Boolean
        );
      }
    } else {
      // TODO: This works around a problem in Ember Data where adding an error without the record being in a dirty state triggers an exception.
      // Ember Data doesn't consider relationship changes a "dirty" change, so this causes issues if the adres is cleared.
      // This workaround uses `.send` but that is a private API which is no longer present in Ember Data 4.x
      // The bug is fixed in Ember Data 4.6 so we need to update to that version instead of 4.4 LTS
      // More information in the Discord: https://discord.com/channels/480462759797063690/1016327513900847134
      // Same old issue where they use this workaround: https://stackoverflow.com/questions/27698496/attempted-to-handle-event-becameinvalid-while-in-state-root-loaded-saved
      this.model.send?.('becomeDirty');
      this.model.errors.add(
        'contacts',
        `Klik op "Contactgegevens toevoegen" om contactgegevens in te vullen${
          this.contactList.length > 0
            ? ' of selecteer een van de bestaande contactgegevens.'
            : '.'
        }`
      );
      return;
    }

    if (
      this.selectedContact.isValid &&
      this.model.contacts.length > 0 &&
      this.model.isValid
    ) {
      let secondaryContactPoint = yield this.selectedContact
        .secondaryContactPoint;
      if (secondaryContactPoint !== null) {
        if (!secondaryContactPoint.telefoon) {
          // The secondary contact point is empty so we can remove it if it was ever persisted before
          yield secondaryContactPoint.destroyRecord();
        }
      }
      yield this.model.save();

      try {
        yield this.router.transitionTo(
          'eredienst-mandatenbeheer.mandatarissen'
        );
      } catch (error) {
        // I believe we're running into this issue: https://github.com/emberjs/ember.js/issues/20038
        // A `TransitionAborted` error is thrown even though the transition is complete, so we hide the error.
      }
    } else {
      return;
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
