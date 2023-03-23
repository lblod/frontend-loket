import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { dropTask } from 'ember-concurrency';
import { combineFullAddress, isValidAdres } from 'frontend-loket/models/adres';
import {
  createPrimaryContactPoint,
  createSecondaryContactPoint,
  isValidPrimaryContact,
} from 'frontend-loket/models/contact-punt';
import { validateMandaat } from 'frontend-loket/models/worship-mandatee';
import {
  setMandate,
  warnOnMandateExceededTimePeriode,
} from 'frontend-loket/utils/eredienst-mandatenbeheer';

export default class EredienstMandatenbeheerNewController extends Controller {
  @service router;
  @service store;

  queryParams = ['personId'];
  @tracked personId = '';
  @tracked warningMessages;
  @tracked selectedContact;
  @tracked editingContact;
  @tracked isManualAddress;

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
  async setMandaat(mandaat) {
    const { worshipMandatee } = this.model;
    const endDateWarnings = await setMandate(
      this.store,
      worshipMandatee,
      mandaat
    );
    const periodeLimitWarnings = await warnOnMandateExceededTimePeriode(
      mandaat,
      this.store,
      worshipMandatee.start,
      worshipMandatee.einde
    );

    if (endDateWarnings || periodeLimitWarnings) {
      this.warningMessages = {
        ...endDateWarnings,
        ...periodeLimitWarnings,
      };
    }
  }

  @action
  async handleDateChange(type, isoDate, date) {
    const { worshipMandatee } = this.model;
    worshipMandatee[type] = date;
    let { einde, start } = worshipMandatee;
    const periodeLimitWarnings = await warnOnMandateExceededTimePeriode(
      await worshipMandatee?.bekleedt,
      this.store,
      start,
      einde
    );
    this.warningMessages = { ...periodeLimitWarnings };
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
    this.model.worshipMandatee.errors.remove('contacts');

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
        worshipMandatee.isValid &&
        adres.isValid
      ) {
        if (adres?.isNew || adres?.hasDirtyAttributes) {
          adres.volledigAdres = combineFullAddress(adres);
          yield adres.save();
        }

        if (contactPoint.isNew) {
          // If we are adding a new contact point, it will always be the "selected" contact after it is saved
          this.selectedContact = contactPoint;
        }

        if (secondaryContactPoint.telefoon) {
          yield secondaryContactPoint.save();
        } else {
          // The secondary contact point is empty so we can remove it if it was ever persisted before
          yield secondaryContactPoint.destroyRecord();
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
}
