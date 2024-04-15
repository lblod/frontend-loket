import Controller from '@ember/controller';
import { service } from '@ember/service';

export default class ApplicationController extends Controller {
  @service currentSession;
  @service impersonation;
  @service session;
  @service router;

  appTitle = 'Loket voor lokale besturen';

  get isIndex() {
    return this.router.currentRouteName === 'index';
  }

  get userInfo() {
    let user;
    let group;
    let classification;

    if (this.currentSession.isAdmin) {
      // TODO: should we create extra "public" properties, so we don't need to use the underscored ones?
      user = this.currentSession._user;
      group = this.currentSession._group;
      classification = this.currentSession._groupClassification;
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

    if (group.naam) {
      groupInfo += ` ${group.naam}`;
    }

    groupInfo.trim();

    if (groupInfo.length) {
      userInfo += ` - ${groupInfo}`;
    }

    return userInfo;
  }
}
