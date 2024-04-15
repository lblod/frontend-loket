import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { dropTask } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MandatenbeheerMandatarissenTotalsComponent extends Component {
  @service() store;

  @tracked isOpen = false;
  @tracked mandatarissenTotals;

  getMandatenOrgaan(bestuursorgaan) {
    const queryParams = {
      filter: {
        'bevat-in': {
          id: bestuursorgaan.get('id'),
        },
      },
      include: [
        'bestuursfunctie',
        'bevat-in',
        'bevat-in.is-tijdsspecialisatie-van',
      ].join(','),
    };
    return this.store.query('mandaat', queryParams);
  }

  getMandatarissenMandaat(mandaat) {
    const queryParams = {
      filter: {
        bekleedt: {
          id: mandaat.get('id'),
        },
      },
      //'filter[:gte:einde]': new Date().toISOString().slice(0, 10), // doesn't work for older periods
      page: { size: 1 },
    };
    return this.store.query('mandataris', queryParams);
  }

  @dropTask
  *getMandatarissenTotals() {
    const bstOrgs = this.args.bestuursorganen;

    const mapMandtnOrgs = yield Promise.all(
      bstOrgs.map(async (o) => {
        return { org: o, mandtn: await this.getMandatenOrgaan(o) };
      }),
    );

    const mapMandtnMandarissen = async (mandaat) => {
      return {
        naam: await mandaat.get('bestuursfunctie.label'),
        aantal: (await this.getMandatarissenMandaat(mandaat)).meta.count,
      };
    };

    const mapMandtrsOrgs = yield Promise.all(
      mapMandtnOrgs.map(async (e) => {
        return {
          orgaan: e.org,
          mandaten: await Promise.all(e.mandtn.map(mapMandtnMandarissen)),
        };
      }),
    );

    this.mandatarissenTotals = mapMandtrsOrgs;

    return mapMandtrsOrgs;
  }

  @action
  toggleOpen() {
    if (!this.isOpen) this.getMandatarissenTotals.perform();
    this.isOpen = !this.isOpen;
  }
}
