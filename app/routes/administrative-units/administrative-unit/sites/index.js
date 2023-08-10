import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class AdministrativeUnitsAdministrativeUnitSitesIndexRoute extends Route {
  @service store;

  async model() {
    let { id: administrativeUnitId } = this.paramsFor(
      'administrative-units.administrative-unit'
    );

    let administrativeUnit = await this.store.findRecord(
      'administrative-unit',
      administrativeUnitId,
      {
        reload: true,
        include: [
          'primary-site.address',
          'primary-site.contacts',
          'primary-site.site-type',
          'sites.address',
          'sites.contacts',
          'sites.site-type',
        ].join(),
      }
    );

    return {
      administrativeUnit: administrativeUnit,
      primarySite: await administrativeUnit.primarySite,
      sites: await administrativeUnit.sites,
    };
  }
}
