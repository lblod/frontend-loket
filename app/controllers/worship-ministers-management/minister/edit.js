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
import { setEmptyStringsToNull } from 'frontend-loket/utils/empty-string-to-null';
import {
  combineFullAddress,
  isValidAdres,
  updateAddressAttributes,
} from 'frontend-loket/models/adres';

export default class WorshipMinistersManagementMinisterEditController extends Controller {
  @service store;
  @service router;

  @tracked selectedContact;
  @tracked editingContact;
  /* is it better to store isManualAddress from the transition.data.isManualAddress
   in the route ? right now it keeps the current value when we leave the page
   don't know if we want this behavior.
  */
  @tracked isManualAddress = false;

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
          'De einddatum moet na de startdatum liggen'
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
    if (this.isManualAddress) {
      // Updating a relationship value doesn't seem to clear the corresponding error messages, so we do it manually
      this.editingContact.errors.remove('adres');
    }
    await this.handleInputToggle();
  }

  @action
  addNewContact() {
    this.model.minister.errors.remove('contacts');

    let primaryContactPoint = createPrimaryContactPoint(this.store);
    let secondaryContactPoint = createSecondaryContactPoint(this.store);

    primaryContactPoint.secondaryContactPoint = secondaryContactPoint;
    this.editingContact = primaryContactPoint;
    if (this.isManualAddress) {
      this.editingContact.adres = this.store.createRecord('adres');
    }
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

      if ((yield isValidPrimaryContact(contactPoint)) && minister.isValid) {
        if (secondaryContactPoint.telefoon) {
          yield secondaryContactPoint.save();
        } else {
          // The secondary contact point is empty so we can remove it if it was ever persisted before
          yield secondaryContactPoint.destroyRecord();
        }
        if (adres?.isNew) {
          if (adres.isValid) {
            adres.volledigAdres =
              typeof adres.volledigAdres === 'string'
                ? adres.volledigAdres
                : combineFullAddress(adres);
            adres = setEmptyStringsToNull(adres); // Creating clean data
            yield adres.save();
          } else {
            return;
          }
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
        yield minister.contacts
      );

      if (this.selectedContact.id !== primaryContactPoint?.id) {
        let secondaryContact = yield this.selectedContact.secondaryContactPoint;

        minister.contacts = [this.selectedContact, secondaryContact].filter(
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
      minister.send?.('becomeDirty');
      minister.errors.add(
        'contacts',
        `Klik op "Contactgegevens toevoegen" om contactgegevens in te vullen${
          contacts.length > 0
            ? ' of selecteer een van de bestaande contactgegevens.'
            : '.'
        }`
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
      } catch (error) {
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
      contactPoint.rollbackAttributes();

      this.editingContact = null;
    }
  }

  async handleInputToggle() {
    const { minister } = this.model;

    let newAddress;
    let currentAddress = await this.editingContact.adres;
    let fetchAddresses = this.store.peekAll('adres');
    // manual mode
    if (this.isManualAddress) {
      // Here we check if there is no adres model linked to the worshipMinister
      if (!minister.contacts.adres && !(await this.editingContact.adres)) {
        console.log('record created');
        newAddress = this.store.createRecord('adres', {
          busnummer: null,
          land: null,
          adresRegisterId: null,
          adresRegisterUri: null,
        });
      } else {
        // here we fetch muliple addresses
        console.log('fetch address');

        // We edit a preselected existing address with manual input mode
        if (await currentAddress.id) {
          console.log('has address');
          newAddress = this.store.peekRecord('adres', await currentAddress.id); // filter for the good record
          newAddress.adresRegisterId = null;
          newAddress.adresRegisterUri = null;
        } else {
          console.log('filter address');
          let filteredAddress = fetchAddresses.filter(
            (adres) => adres.hasDirtyAttributes
          );
          console.log('dirty address', filteredAddress[0]);
          // Creating a new record from the selected data but without register uri and id
          newAddress = this.store.createRecord(
            'adres',
            updateAddressAttributes(filteredAddress[0])
          );
          filteredAddress[0].rollbackAttributes(); // Cleaning the filtered adres model
          console.log('filtered address', newAddress);
        }
      }
      console.log('if manual address', newAddress);
      // here we link the address to the contact-punt
      this.editingContact.adres = newAddress; // undefined, should be updateAddressAttributes(filteredAddress[0]);
      // case : address selector
    } else {
      // Case if we have an address we remove it.
      // unless it's already linked to the contact-punt
      // let dataAddresses = this.store.peekAll('adres'); // we find addresses
      let filteredAddress = fetchAddresses.filter(
        (adres) => adres.hasDirtyAttributes
      ); // Case we have more than one adres we must pick the one with no data
      if (await currentAddress.id) {
        console.log('current address manual update');
        newAddress = fetchAddresses.firstObject;
      } else {
        console.log('Selected Address case', filteredAddress);
        filteredAddress[0].rollbackAttributes(); // Cleaning the data
      }
    }
  }
}
