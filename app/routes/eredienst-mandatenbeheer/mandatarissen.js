import Route from '@ember/routing/route';
// eslint-disable-next-line ember/no-mixins
import DataTableRouteMixin from 'frontend-loket/mixins/ember-data-table/route';
import { inject as service } from '@ember/service';
import { getUniqueBestuursorganen } from 'frontend-loket/models/mandataris';
import { hash } from 'rsvp';
import moment from 'moment';

export const NO_PROVENANCE_VENDOR_ID = 'none';

async function getOtherPeriods(mandataris, selectedPeriod) {
  const mandate = await mandataris.bekleedt;
  const bestuursorganenInTijd = await mandate.bevatIn;

  const ranges = bestuursorganenInTijd
    .map((b) => ({
      startDate: moment(b.bindingStart).format('YYYY-MM-DD'),
      endDate: b.bindingEinde
        ? moment(b.bindingEinde).format('YYYY-MM-DD')
        : null,
    }))
    .filter(
      (p) =>
        p.startDate !== selectedPeriod.startDate ||
        p.endDate !== selectedPeriod.endDate,
    )
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .map(
      (p) =>
        `${moment(p.startDate).format('YYYY')}-${p.endDate ? moment(p.endDate).format('YYYY') : 'heden'}`,
    );

  return [...new Set(ranges)].join(', ');
}

export default class EredienstMandatenbeheerMandatarissenRoute extends Route.extend(
  DataTableRouteMixin,
) {
  @service store;

  queryParams = {
    filter: { refreshModel: true },
    page: { refreshModel: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
    vendorId: { refreshModel: true },
  };

  modelName = 'worship-mandatee';

  beforeModel() {
    const mandatenbeheer = this.modelFor('eredienst-mandatenbeheer');
    this.mandatenbeheer = mandatenbeheer;
  }

  async afterModel(mandatarissen) {
    const selectedPeriod = this.mandatenbeheer.selectedPeriod;

    let mandatarisBestuursorganen = mandatarissen.reduce((data, mandataris) => {
      data[mandataris.id] = getUniqueBestuursorganen(mandataris);
      return data;
    }, {});

    let mandatarisOtherPeriods = mandatarissen.reduce((data, mandataris) => {
      data[mandataris.id] = getOtherPeriods(mandataris, selectedPeriod);
      return data;
    }, {});

    this.mandatarisBestuursorganen = await hash(mandatarisBestuursorganen);
    this.mandatarisOtherPeriods = await hash(mandatarisOtherPeriods);
  }

  mergeQueryOptions(params) {
    const bestuursorganenIds = this.mandatenbeheer.bestuursorganen.map((o) =>
      o.get('id'),
    );

    const queryParams = {
      sort: params.sort,
      filter: {
        bekleedt: {
          'bevat-in': {
            id: bestuursorganenIds.join(','),
          },
        },
      },
      include: [
        'bekleedt.bevat-in.is-tijdsspecialisatie-van',
        'is-bestuurlijke-alias-van',
        'bekleedt.bestuursfunctie',
        'provenance',
      ].join(','),
    };

    if (params.filter) {
      queryParams['filter']['is-bestuurlijke-alias-van'] = params.filter;
    }

    if (params.vendorId === NO_PROVENANCE_VENDOR_ID) {
      queryParams['filter'][':has-no:provenance'] = true;
    } else if (params.vendorId) {
      queryParams['filter']['provenance'] = { id: params.vendorId };
    }

    return queryParams;
  }

  setupController(controller) {
    super.setupController(...arguments);
    controller.searchData = this.paramsFor(
      'eredienst-mandatenbeheer.mandatarissen',
    )['filter'];
    controller.mandatenbeheer = this.mandatenbeheer;
    controller.mandatarisBestuursorganen = this.mandatarisBestuursorganen;
    controller.mandatarisOtherPeriods = this.mandatarisOtherPeriods;
  }
}
