import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { setContext, setUser } from '@sentry/ember';
import config from 'frontend-loket/config/environment';
import { loadAccountData } from 'frontend-loket/utils/account';
import { SHOULD_ENABLE_SENTRY } from 'frontend-loket/utils/sentry';

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
};

const ADMIN_ROLE = 'LoketLB-admin';

export default class CurrentSessionService extends Service {
  @service session;
  @service store;
  @service impersonation;

  @tracked _account;
  @tracked _user;
  @tracked _group;
  @tracked _groupClassification;
  @tracked _roles = [];

  get account() {
    if (this.impersonation.isImpersonating) {
      return this.impersonation.impersonatedAccount;
    } else {
      return this._account;
    }
  }
  get user() {
    return this.account?.gebruiker;
  }

  get group() {
    return this.user?.group;
  }

  get groupClassification() {
    return this.group?.belongsTo('classificatie').value()
  }

  async load() {
    if (this.session.isAuthenticated) {
      let accountId =
        this.session.data.authenticated.relationships.account.data.id;
      this._account = await loadAccountData(this.store, accountId);

      // TODO: I don't think we need all of these as properties
      this._user = this._account.gebruiker;
      this._roles = this.session.data.authenticated.data.attributes.roles;

      // We need to do an extra API call here because ACM/IDM users don't seem to have a "bestuurseenheden" relationship in the DB.
      // By fetching the record directly we bypass that issue
      const groupId = this.session.data.authenticated.relationships.group.data.id;
      this._group = await this.store.findRecord('bestuurseenheid', groupId, {
        include: 'classificatie',
        reload: true,
      });
      this._groupClassification = await this.group.classificatie;

      if (this.isAdmin) {
        await this.impersonation.load();
      }

      this.setupSentrySession();
    }
  }

  setupSentrySession() {
    if (SHOULD_ENABLE_SENTRY) {
      setUser({ id: this._user.id, ip_address: null });
      setContext('session', {
        account: this._account.id,
        user: this._user.id,
        group: this._group.uri,
        groupClassification: this._groupClassification?.uri,
        roles: this._roles,
      });
    }
  }

  canAccess(role) {
    if (this.impersonation.isImpersonating) {
      return this.impersonation.impersonatedAccount.roles.includes(role);
    } else {
      return this._roles.includes(role);
    }
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
    return this.canAccess(MODULE_ROLE.SUBSIDIES);
  }

  get canAccessWorshipMinisterManagement() {
    return this.canAccess(MODULE_ROLE.WORSHIP_MINISTER_MANAGEMENT);
  }

  get canAccessEredienstMandatenbeheer() {
    return this.canAccess(MODULE_ROLE.EREDIENSTMANDATENBEHEER);
  }

  get canAccessPublicServices() {
    return (
      this.canAccess(MODULE_ROLE.PUBLIC_SERVICES) && !config.lpdcUrl.startsWith('{{')
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

  get canAccessModules() {
    return Object.values(MODULE_ROLE).some((module) => {
      return this.canAccess(module);
    })
  }

  get isAdmin() {
    return this._roles.includes(ADMIN_ROLE);
  }
}

