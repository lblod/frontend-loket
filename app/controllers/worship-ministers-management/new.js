import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { dropTask } from 'ember-concurrency';
import {
  createPrimaryContactPoint,
  createSecondaryContactPoint,
  isValidPrimaryContact,
} from 'frontend-loket/models/contact-punt';
import { validateFunctie } from 'frontend-loket/models/minister';
import {
  combineFullAddress,
  isValidAdres,
  updateAddressAttributes,
} from 'frontend-loket/models/adres';
import { setEmptyStringsToNull } from 'frontend-loket/utils/empty-string-to-null';

export default class WorshipMinistersManagementNewController extends Controller {
  @service router;
  @service store;

  queryParams = ['personId'];

  @tracked personId = '';
  @tracked selectedContact;
  @tracked editingContact;
  /* is it better to store isManualAddress from the transition.data.isManualAddress
   in the route ? right now it keeps the current value when we leave the page
   don't know if we want this behavior.
  */
  @tracked isManualAddress = false;

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
      this.model.worshipMinister.errors.remove('contacts');
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
    this.model.worshipMinister.errors.remove('contacts');

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
  *createWorshipMinister(event) {
    event.preventDefault();

    let { worshipMinister, contacts } = this.model;
    worshipMinister.errors.remove('contacts');

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

      // the user is using input mode manual, we trigger error messages here.
      if (this.isManualAddress) {
        yield isValidAdres(adres);
      }

      // in this case the contact point information and address should be valid
      if (
        (yield isValidPrimaryContact(contactPoint)) &&
        worshipMinister.isValid
      ) {
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
      let secondaryContact = yield this.selectedContact.secondaryContactPoint;
      worshipMinister.contacts = [
        this.selectedContact,
        secondaryContact,
      ].filter(Boolean);
    } else {
      worshipMinister.errors.add(
        'contacts',
        `Klik op "Contactgegevens toevoegen" om contactgegevens in te vullen${
          contacts.length > 0
            ? ' of selecteer een van de bestaande contactgegevens.'
            : '.'
        }`
      );
      return;
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

  async handleInputToggle() {
    const { worshipMinister } = this.model;

    let newAddress;
    let currentAddress = await this.editingContact.adres;
    let fetchAddresses = this.store.peekAll('adres');
    // manual mode
    if (this.isManualAddress) {
      // Here we check if there is no adres model linked to the worshipMinister
      if (
        !worshipMinister.contacts.adres &&
        !(await this.editingContact.adres)
      ) {
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
          // this.editingContact.adres
          console.log('dirty address', filteredAddress[0]);
          // Creating a new record from the selected data but without register uri and id
          newAddress = this.store.createRecord(
            'adres',
            updateAddressAttributes(filteredAddress[0])
          );
          filteredAddress[0].rollbackAttributes(); // Cleaning the filtered adres model if we have one that persisted
          console.log('filtered address', newAddress);
        }
      }
      console.log('if manual address', newAddress);
      // here we link the address to the contact-punt
      this.editingContact.adres = newAddress;
      // case : address selector
    } else {
      // Case if we have an address we remove it.
      // unless it's already linked to the contact-punt
      let filteredAddress = fetchAddresses.filter(
        (adres) => adres.hasDirtyAttributes
      ); // Case we have more than one adres we must pick the one with no data
      if (await currentAddress.id) {
        console.log('current address manual update');
        newAddress = fetchAddresses[0];
      } else {
        console.log('Selected Address case', filteredAddress);
        filteredAddress[0].rollbackAttributes(); // Cleaning the data
      }
    }
  }
}
