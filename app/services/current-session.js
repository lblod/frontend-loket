import Service, { inject as service } from '@ember/service';
import { macroCondition, getOwnConfig } from '@embroider/macros';
import { tracked } from '@glimmer/tracking';
import { setContext, setUser } from '@sentry/ember';
import config from 'frontend-loket/config/environment';
import { loadAccountData } from 'frontend-loket/utils/account';
import { SHOULD_ENABLE_SENTRY } from 'frontend-loket/utils/sentry';

const MODULE = {
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
    return this.account.gebruiker;
  }

  get group() {
    return this.user.group;
  }

  get groupClassification() {
    return this.group.belongsTo('classificatie').value()
  }

  async load() {
    if (this.session.isAuthenticated) {
      let accountId =
        this.session.data.authenticated.relationships.account.data.id;
      this._account = await loadAccountData(this.store, accountId);

      // TODO: I don't think we need all of these as properties
      this._user = this._account.gebruiker;
      this._roles = this.session.data.authenticated.data.attributes.roles;
      this._group = this._user.group;
      this._groupClassification = this._group.belongsTo('classificatie').value();
      // this._groupClassification = await this._group.classificatie;

      // let groupId = this.session.data.authenticated.relationships.group.data.id;
      // this._group = await this.store.findRecord('bestuurseenheid', groupId, {
      //   include: 'classificatie',
      //   reload: true,
      // });
      // this._groupClassification = await this._group.classificatie;

      if (macroCondition(getOwnConfig().controle)) {
        if (this.canImpersonate) {
          await this.impersonation.load();
        }
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
      MODULE.WORSHIP_MINISTER_MANAGEMENT,
    );
  }

  get hasViewOnlyWorshipMandateesManagementData() {
    return !!this.group.viewOnlyModules?.includes(
      MODULE.EREDIENSTMANDATENBEHEER,
    );
  }

  get canAccessWorshipDecisionsDb() {
    return (
      this.canAccess(MODULE.WORSHIP_DECISIONS_DB) &&
      !config.worshipDecisionsDatabaseUrl.startsWith('{{')
    );
  }

  get canAccessWorshipOrganisationsDb() {
    return (
      this.canAccess(MODULE.WORSHIP_ORGANISATIONS_DB) &&
      !config.worshipOrganisationsDatabaseUrl.startsWith('{{')
    );
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

  get canAccessWorshipMinisterManagement() {
    return this.canAccess(MODULE.WORSHIP_MINISTER_MANAGEMENT);
  }

  get canAccessEredienstMandatenbeheer() {
    return this.canAccess(MODULE.EREDIENSTMANDATENBEHEER);
  }

  get canAccessPublicServices() {
    return (
      this.canAccess(MODULE.PUBLIC_SERVICES) && !config.lpdcUrl.startsWith('{{')
    );
  }

  get canAccessVerenigingen() {
    return (
      this.canAccess(MODULE.VERENIGINGEN) &&
      !config.verenigingenUrl.startsWith('{{')
    );
  }

  get canAccessContact() {
    return (
      this.canAccess(MODULE.CONTACT) && !config.contactUrl.startsWith('{{')
    );
  }

  get isAdmin() {
    return this._roles.includes('LoketAdmin');
  }

  get canImpersonate() {
    if (macroCondition(getOwnConfig().controle)) {
      return this.isAdmin;
    } else {
      return false;
    }
  }
}

