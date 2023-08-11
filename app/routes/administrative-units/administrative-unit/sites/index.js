import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class AdministrativeUnitsAdministrativeUnitSitesIndexRoute extends Route {
  @service store;
  @service session;

  async model() {
    let bestuurseenheidId =
      this.session.data.authenticated.relationships.group.data.id;
    let bestuurseenheid = await this.store.findRecord(
      'bestuurseenheid',
      bestuurseenheidId,
      { includes: 'contactinfo.adres' }
    );
    let addresses = [];
    for (let i = 0; i < bestuurseenheid.contactinfo.length; i++) {
      addresses.push(bestuurseenheid.contactinfo[i].adres);
    }
    console.log(bestuurseenheid.contactinfo);
    //   let { id: administrativeUnitId } = this.paramsFor(
    //     'administrative-units.administrative-unit'
    //   );

    //   let administrativeUnit = await this.store.findRecord(
    //     'administrative-unit',
    //     administrativeUnitId,
    //     {
    //       reload: true,
    //       include: [
    //         'primary-site.address',
    //         'primary-site.contacts',
    //         'primary-site.site-type',
    //         'sites.address',
    //         'sites.contacts',
    //         'sites.site-type',
    //       ].join(),
    //     }
    //   );

    return {
      sites: addresses,
    };
  }
}
