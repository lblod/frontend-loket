import Controller from '@ember/controller';
import { service } from '@ember/service';
import isFeatureEnabled from 'frontend-loket/helpers/is-feature-enabled';

export default class ApplicationController extends Controller {
  @service currentSession;
  @service impersonation;
  @service session;
  @service router;

  appTitle = 'Loket voor lokale besturen';

  maybeAddNewLoketClass = function () {
    if (isFeatureEnabled('new-loket')) {
      document.body.classList.add('new-loket');
    }
  };

  get isIndex() {
    return this.router.currentRouteName === 'index';
  }

  get isNewLoketPage() {
    const NEW_LOKET_ROUTES = ['index', 'search', 'products', 'favorites'];
    const currentRouteName = this.router.currentRouteName;

    return NEW_LOKET_ROUTES.some((routeName) => {
      return currentRouteName.startsWith(routeName);
    });
  }

  get userInfo() {
    let user;
    let group;
    let classification;

    if (this.impersonation.isImpersonating) {
      user = this.impersonation.originalAccount.gebruiker;
      group = this.impersonation.originalGroup;
      classification = group.belongsTo('classificatie').value();
    } else {
      user = this.currentSession.user;
      group = this.currentSession.group;
      classification = this.currentSession.groupClassification;
    }

    if (!user) {
      return '';
    }

    let userInfo = user.fullName;
    let groupInfo = '';

    if (classification?.label) {
      groupInfo += classification.label;
    }

    if (group?.naam) {
      groupInfo += ` ${group.naam}`;
    }

    groupInfo.trim();

    if (groupInfo.length) {
      userInfo += ` - ${groupInfo}`;
    }

    return userInfo;
  }
}
