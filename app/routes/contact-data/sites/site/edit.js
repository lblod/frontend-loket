import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { getSiteValidations } from 'frontend-loket/validations/sites';
import { createValidatedChangeset } from 'frontend-loket/utils/changeset';

export default class ContactDataSitesSiteEditRoute extends Route {
  @service currentSession;
  @service store;
  @service router;

  beforeModel() {
    if (!this.currentSession.canEdit) {
      this.router.transitionTo('route-not-found', {
        wildcard: 'pagina-niet-gevonden',
      });
    }
  }

  async model() {
    const sites = this.modelFor('contact-data.sites');
    let { id: siteId } = this.paramsFor('contact-data.sites.site');
    const site = sites['sites'].find((site) => site.id === siteId);
    const primaryContact = site['contacts'].find(
      (contact) => contact.type === 'Primary'
    );
    const secondaryContact = site['contacts'].find(
      (contact) => contact.type === 'Secondary'
    );
    return {
      site: createValidatedChangeset(site, getSiteValidations()),
      sites,
      primaryContact,
      secondaryContact,
    };
  }
}
