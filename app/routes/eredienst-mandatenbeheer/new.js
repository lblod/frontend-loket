import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { CONTACT_TYPE } from 'frontend-loket/models/contact-punt';

export default class EredienstMandatenbeheerNewRoute extends Route {
  @service currentSession;
  @service store;

  queryParams = {
    personId: {
      refreshModel: true,
    },
  };

  beforeModel() {
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
        transition.data.selectedContact = contacts.firstObject;
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
  }

  resetController(controller, isExiting) {
    super.resetController(...arguments);
    if (isExiting) {
      controller.personId = '';
      controller.model?.worshipMandatee?.rollbackAttributes();
      controller.rollbackUnsavedChanges();
    }
  }
}
