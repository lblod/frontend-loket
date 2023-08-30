import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { CONTACT_TYPE } from 'frontend-loket/models/contact-punt';

export default class EredienstMandatenbeheerNewRoute extends Route {
  @service currentSession;
  @service store;
  @service router;

  queryParams = {
    personId: {
      refreshModel: true,
    },
  };

  beforeModel() {
    if (this.currentSession.hasViewOnlyWorshipMandateesManagementData) {
      this.router.transitionTo('eredienst-mandatenbeheer.mandatarissen');
    }
    const mandatenbeheer = this.modelFor('eredienst-mandatenbeheer');
    this.bestuursorganen = mandatenbeheer.bestuursorganen;
  }

  async model({ personId }, transition) {
    if (personId) {
      let [person, tijdsspecialisaties] = await Promise.all([
        this.store.findRecord('persoon', personId, {
          backgroundReload: false,
        }),
        this.bestuursorganen,
      ]);

      let worshipMandatee = this.store.createRecord('worship-mandatee');
      worshipMandatee.isBestuurlijkeAliasVan = person;

      let contacts = await this.store.query('contact-punt', {
        'filter[agents-in-position][is-bestuurlijke-alias-van][id]': person.id,
        'filter[type]': CONTACT_TYPE.PRIMARY,
        include: 'adres,secondary-contact-point',
      });

      if (contacts.length === 1) {
        transition.data.selectedContact = contacts.at(0);
      }

      return {
        worshipMandatee,
        person,
        contacts,
        bestuursorganen: tijdsspecialisaties,
      };
    }

    return {};
  }

  setupController(controller, model, transition) {
    super.setupController(...arguments);
    if (!controller.hasContact && !controller.shouldSelectPerson) {
      controller.addNewContact();
    }
    controller.selectedContact = transition.data.selectedContact;
    controller.warningMessages = {};
  }

  resetController(controller, isExiting) {
    super.resetController(...arguments);
    if (isExiting) {
      controller.personId = '';
      controller.rollbackUnsavedChanges();
    }
  }
}
