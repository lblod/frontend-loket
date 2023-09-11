import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ContactDataSitesSiteIndexRoute extends Route {
  @service store;

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
    return { site, sites, primaryContact, secondaryContact };
  }
}
