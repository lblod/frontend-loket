import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { setContext, setUser } from '@sentry/ember';
import config from 'frontend-loket/config/environment';
import { loadAccountData } from 'frontend-loket/utils/account';
import { SHOULD_ENABLE_SENTRY } from 'frontend-loket/utils/sentry';
import isFeatureEnabled from 'frontend-loket/helpers/is-feature-enabled';

const MODULE_ROLE = {
  SUPERVISION: 'LoketLB-toezichtGebruiker',
  BERICHTENCENTRUM: 'LoketLB-berichtenGebruiker',
  BBCDR: 'LoketLB-bbcdrGebruiker',
  MANDATENBEHEER: 'LoketLB-mandaatGebruiker',
  LEIDINGGEVENDENBEHEER: 'LoketLB-leidinggevendenGebruiker',
  PERSONEELSBEHEER: 'LoketLB-personeelsbeheer',
  SUBSIDIES: 'LoketLB-subsidies',
  WORSHIP_MINISTER_MANAGEMENT: 'LoketLB-eredienstBedienaarGebruiker',
  EREDIENSTMANDATENBEHEER: 'LoketLB-eredienstMandaatGebruiker',
  PUBLIC_SERVICES: 'LoketLB-LPDCGebruiker',
  WORSHIP_DECISIONS_DB: 'LoketLB-databankEredienstenGebruiker',
  WORSHIP_ORGANISATIONS_DB: 'LoketLB-eredienstOrganisatiesGebruiker',
  VERENIGINGEN: 'LoketLB-verenigingenGebruiker',
  CONTACT: 'LoketLB-ContactOrganisatiegegevensGebruiker',
  OPEN_PROCES_HUIS: config.openProcesHuisRole.startsWith('{{')
    ? 'LoketLB-OpenProcesHuisGebruiker'
    : config.openProcesHuisRole,
};

const ADMIN_ROLE = 'LoketLB-admin';

export default class CurrentSessionService extends Service {
  @service session;
  @service store;
  @service impersonation;

  @tracked account;
  @tracked user;
  @tracked group;
  @tracked groupClassification;
  @tracked _roles = [];

  async load() {
    if (this.session.isAuthenticated) {
      await this.impersonation.load();

      let accountId =
        this.session.data.authenticated.relationships.account.data.id;
      this.account = await loadAccountData(this.store, accountId);

      this.user = this.account.gebruiker;
      this._roles = this.session.data.authenticated.data.attributes.roles;

      // We need to do an extra API call here because ACM/IDM users don't seem to have a "bestuurseenheden" relationship in the DB.
      // By fetching the record directly we bypass that issue
      const groupId =
        this.session.data.authenticated.relationships.group.data.id;
      this.group = await this.store.findRecord('bestuurseenheid', groupId, {
        include: 'classificatie',
        reload: true,
      });
      this.groupClassification = await this.group.classificatie;

      this.setupSentrySession();
    }
  }

  setupSentrySession() {
    if (SHOULD_ENABLE_SENTRY) {
      let account;
      let user;
      let group;
      let groupClassification;
      let roles;

      if (this.impersonation.isImpersonating) {
        account = this.impersonation.originalAccount;
        user = account.gebruiker;
        group = this.impersonation.originalGroup;
        groupClassification = group.belongsTo('classificatie').value();
        roles = this.impersonation.originalRoles;
      } else {
        account = this.account;
        user = this.user;
        group = this.group;
        groupClassification = this.groupClassification;
        roles = this._roles;
      }

      setUser({ id: user.id, ip_address: null });
      setContext('session', {
        account: account.id,
        user: user.id,
        group: group.uri,
        groupClassification: groupClassification?.uri,
        roles,
      });
    }
  }

  canAccess(role) {
    return this._roles.includes(role);
  }

  get hasViewOnlyWorshipMinistersManagementData() {
    return !!this.group.viewOnlyModules?.includes(
      MODULE_ROLE.WORSHIP_MINISTER_MANAGEMENT,
    );
  }

  get hasViewOnlyWorshipMandateesManagementData() {
    return !!this.group.viewOnlyModules?.includes(
      MODULE_ROLE.EREDIENSTMANDATENBEHEER,
    );
  }

  get canAccessWorshipDecisionsDb() {
    return (
      this.canAccess(MODULE_ROLE.WORSHIP_DECISIONS_DB) &&
      !config.worshipDecisionsDatabaseUrl.startsWith('{{')
    );
  }

  get canAccessWorshipOrganisationsDb() {
    return (
      this.canAccess(MODULE_ROLE.WORSHIP_ORGANISATIONS_DB) &&
      !config.worshipOrganisationsDatabaseUrl.startsWith('{{')
    );
  }

  get canAccessToezicht() {
    return this.canAccess(MODULE_ROLE.SUPERVISION);
  }

  get canAccessBbcdr() {
    return this.canAccess(MODULE_ROLE.BBCDR);
  }

  get canAccessMandaat() {
    return this.canAccess(MODULE_ROLE.MANDATENBEHEER);
  }

  get canAccessBerichten() {
    return this.canAccess(MODULE_ROLE.BERICHTENCENTRUM);
  }

  get canAccessLeidinggevenden() {
    return this.canAccess(MODULE_ROLE.LEIDINGGEVENDENBEHEER);
  }

  get canAccessPersoneelsbeheer() {
    return this.canAccess(MODULE_ROLE.PERSONEELSBEHEER);
  }

  get canAccessSubsidies() {
    if (isFeatureEnabled('subsidies-external')) {
      return (
        this.canAccess(MODULE_ROLE.SUBSIDIES) &&
        !config.subsidiesUrl.startsWith('{{')
      );
    } else {
      return this.canAccess(MODULE_ROLE.SUBSIDIES);
    }
  }

  get canAccessWorshipMinisterManagement() {
    return this.canAccess(MODULE_ROLE.WORSHIP_MINISTER_MANAGEMENT);
  }

  get canAccessEredienstMandatenbeheer() {
    return this.canAccess(MODULE_ROLE.EREDIENSTMANDATENBEHEER);
  }

  get canAccessPublicServices() {
    return (
      this.canAccess(MODULE_ROLE.PUBLIC_SERVICES) &&
      !config.lpdcUrl.startsWith('{{')
    );
  }

  get canAccessVerenigingen() {
    return (
      this.canAccess(MODULE_ROLE.VERENIGINGEN) &&
      !config.verenigingenUrl.startsWith('{{')
    );
  }

  get canAccessContact() {
    return (
      this.canAccess(MODULE_ROLE.CONTACT) && !config.contactUrl.startsWith('{{')
    );
  }

  get canAccessOpenProcesHuis() {
    return (
      this.canAccess(MODULE_ROLE.OPEN_PROCES_HUIS) &&
      !config.openProcesHuisUrl.startsWith('{{')
    );
  }

  get canAccessModules() {
    return Object.values(MODULE_ROLE).some((module) => {
      return this.canAccess(module);
    });
  }

  get isAdmin() {
    let roles = this._roles;
    if (this.impersonation.isImpersonating) {
      roles = this.impersonation.originalRoles || [];
    }
    return roles.includes(ADMIN_ROLE);
  }
}
