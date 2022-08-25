import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import isFeatureEnabled from 'frontend-loket/helpers/is-feature-enabled';

const MODULE = {
  SUPERVISION: 'LoketLB-toezichtGebruiker',
  BERICHTENCENTRUM: 'LoketLB-berichtenGebruiker',
  BBCDR: 'LoketLB-bbcdrGebruiker',
  MANDATENBEHEER: 'LoketLB-mandaatGebruiker',
  LEIDINGGEVENDENBEHEER: 'LoketLB-leidinggevendenGebruiker',
  PERSONEELSBEHEER: 'LoketLB-personeelsbeheer',
  SUBSIDIES: 'LoketLB-subsidies',
  BEDIENARENBEHEER: 'LoketLB-eredienstBedienaarGebruiker',
  EREDIENSTMANDATENBEHEER: 'LoketLB-eredienstMandaatGebruiker',
  PUBLIC_SERVICES: 'LoketLB-LPDCGebruiker',
};

export default class CurrentSessionService extends Service {
  @service session;
  @service store;

  @tracked account;
  @tracked user;
  @tracked group;
  @tracked groupClassification;
  @tracked roles = [];

  async load() {
    if (this.session.isAuthenticated) {
      let accountId =
        this.session.data.authenticated.relationships.account.data.id;
      this.account = await this.store.findRecord('account', accountId, {
        include: 'gebruiker',
      });

      this.user = await this.account.gebruiker;
      this.roles = this.session.data.authenticated.data.attributes.roles;

      let groupId = this.session.data.authenticated.relationships.group.data.id;
      this.group = await this.store.findRecord('bestuurseenheid', groupId, {
        include: 'classificatie',
      });
      this.groupClassification = await this.group.classificatie;
    }
  }

  canAccess(role) {
    return this.roles.includes(role);
  }

  get canAccessToezicht() {
    return this.canAccess(MODULE.SUPERVISION);
  }

  get canAccessBbcdr() {
    return this.canAccess(MODULE.BBCDR);
  }

  get canAccessMandaat() {
    return this.canAccess(MODULE.MANDATENBEHEER);
  }

  get canAccessBerichten() {
    return this.canAccess(MODULE.BERICHTENCENTRUM);
  }

  get canAccessLeidinggevenden() {
    return this.canAccess(MODULE.LEIDINGGEVENDENBEHEER);
  }

  get canAccessPersoneelsbeheer() {
    return this.canAccess(MODULE.PERSONEELSBEHEER);
  }

  get canAccessSubsidies() {
    return this.canAccess(MODULE.SUBSIDIES);
  }

  get canAccessBedienarenbeheer() {
    return this.canAccess(MODULE.BEDIENARENBEHEER);
  }

  get canAccessEredienstMandatenbeheer() {
    return (
      isFeatureEnabled('eredienst-mandatenbeheer') &&
      this.canAccess(MODULE.EREDIENSTMANDATENBEHEER)
    );
  }

  get canAccessPublicServices() {
    return (
      isFeatureEnabled('public-services') && this.canAccess(MODULE.SUBSIDIES)
    );
  }
}
