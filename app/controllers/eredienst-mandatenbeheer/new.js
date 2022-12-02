import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { dropTask } from 'ember-concurrency';
import {
  combineFullAddress,
  isValidAdres,
  updateAddressAttributes,
} from 'frontend-loket/models/adres';
import {
  createPrimaryContactPoint,
  createSecondaryContactPoint,
  isValidPrimaryContact,
} from 'frontend-loket/models/contact-punt';
import { validateMandaat } from 'frontend-loket/models/worship-mandatee';
import { setEmptyStringsToNull } from 'frontend-loket/utils/empty-string-to-null';
import { setExpectedEndDate } from 'frontend-loket/utils/eredienst-mandatenbeheer';

export default class EredienstMandatenbeheerNewController extends Controller {
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
  selectPersoon(person) {
    this.router.transitionTo({ queryParams: { personId: person.id } });
  }

  @action
  createNewPerson(hasData) {
    hasData
      ? this.router.transitionTo('eredienst-mandatenbeheer.new-person', {
          queryParams: hasData,
        })
      : this.router.transitionTo('eredienst-mandatenbeheer.new-person');
  }

  @action
  cancel() {
    this.router.transitionTo('eredienst-mandatenbeheer.mandatarissen');
  }

  @action
  setMandaat(mandaat) {
    const { worshipMandatee } = this.model;
    worshipMandatee.bekleedt = mandaat;
    worshipMandatee.errors.remove('bekleedt');
    setExpectedEndDate(this.store, worshipMandatee, mandaat);
  }

  @action
  handleDateChange(type, isoDate, date) {
    const { worshipMandatee } = this.model;
    worshipMandatee[type] = date;
    let { einde, start } = worshipMandatee;
    if (einde instanceof Date && start instanceof Date) {
      if (einde <= start) {
        worshipMandatee.errors.add(
          'einde',
          'De einddatum moet na de startdatum liggen'
        );
      } else {
        worshipMandatee.errors.remove('einde');
      }
    }
  }

  @action
  handleContactSelectionChange(contact, isSelected) {
    if (isSelected) {
      this.model.worshipMandatee.errors.remove('contacts');
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
    this.model.worshipMandatee.errors.remove('contacts');

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
  *createMandatee(event) {
    event.preventDefault();

    let { worshipMandatee, contacts } = this.model;
    this.model.worshipMandatee.errors.remove('contacts');

    if (!worshipMandatee.start) {
      worshipMandatee.errors.add('start', 'startdatum is een vereist veld.');
    }
    yield validateMandaat(worshipMandatee);

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
        worshipMandatee.isValid
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

    if (this.selectedContact) {
      let secondaryContact = yield this.selectedContact.secondaryContactPoint;

      worshipMandatee.contacts = [
        this.selectedContact,
        secondaryContact,
      ].filter(Boolean);
    } else {
      worshipMandatee.errors.add(
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
      worshipMandatee.isValid &&
      worshipMandatee.contacts.length > 0 &&
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
      yield worshipMandatee.save();

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
    this.model?.worshipMandatee?.rollbackAttributes();
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
    const { worshipMandatee } = this.model;

    let newAddress;
    let currentAddress = await this.editingContact.adres;
    let fetchAddresses = this.store.peekAll('adres');

    // manual mode
    if (this.isManualAddress) {
      // Here we check if there is no adres model linked to the worshipMinister
      if (
        !worshipMandatee.contacts.adres &&
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
