import Helper from '@ember/component/helper';
import { service } from '@ember/service';

const defaultManualLink =
  'https://abb-vlaanderen.gitbook.io/hoofdloket-handleiding-loket-lokale-besturen';

/**
 * A helper that looks the meta data of all active routes and retrieves the userManualLink value and falls back to the generic loket manual if none is found.
 */
export default class RelevantUserManualLink extends Helper {
  @service router;

  compute() {
    let manualLink = defaultManualLink;
    let route = this.router.currentRoute;

    do {
      if (route.metadata?.userManualLink) {
        manualLink = route.metadata.userManualLink;
        break;
      } else {
        route = route.parent;
      }
    } while (route);

    return manualLink;
  }
}

// Simple util that sets up the route meta object as expected.
export function buildLinkMetaObject(userManualLink) {
  return { userManualLink };
}
