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
    // console.log('model', this.model.contacts);
    console.log('length', this.model?.contacts?.length);
    console.log('hasContact', this.model?.contacts?.length !== 0);
    return this.model?.contacts?.length !== 0;
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
    console.log('editing contact', this.isEditingContactPoint);
    if (this.isEditingContactPoint) {
      // This part might need some refactoring
      if (!worshipMinister.agentStartDate) {
        worshipMinister.errors.add(
          'agentStartDate',
          'startdatum is een vereist veld.'
        );
      }
      yield validateFunctie(worshipMinister);
      // refactoring part end
      let contactPoint = this.editingContact;
      console.log('contact point is new', contactPoint.isNew);
      let secondaryContactPoint = yield contactPoint.secondaryContactPoint;
      let adres = yield contactPoint.adres;

      if (yield isValidPrimaryContact(contactPoint)) {
        console.log('valid primary');
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

        // yield contactPoint.save();
      } else {
        return;
      }
    }

    if (this.selectedContact) {
      let primaryContactPoint = findPrimaryContactPoint(yield contacts);
      console.log('selected contact', this.selectedContact.id);
      // this pass the check but does not have any id
      // So the filter is just returning false false
      if (this.selectedContact.id !== primaryContactPoint?.id) {
        console.log('test passed');
        let secondaryContact = yield this.selectedContact.secondaryContactPoint;
        console.log('secondaryContact', secondaryContact);
        console.log('primary contact', this.selectedContact);

        console.log(worshipMinister.contacts);
        worshipMinister.contacts = [
          this.selectedContact,
          secondaryContact,
        ].filter(Boolean);
      }
    } else {
      console.log('no contacts');
      worshipMinister.contacts = [];
    }
    if (!worshipMinister.agentStartDate) {
      worshipMinister.errors.add(
        'agentStartDate',
        'startdatum is een vereist veld.'
      );
    }
    if (
      (yield validateFunctie(worshipMinister)) &&
      worshipMinister.isValid &&
      worshipMinister.contacts.length > 0
    ) {
      yield this.editingContact.save();
      yield worshipMinister.save();
      this.router.transitionTo(
        'worship-ministers-management.minister.edit',
        worshipMinister.id
      );
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
