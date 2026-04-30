import Route from '@ember/routing/route';
// eslint-disable-next-line ember/no-mixins
import DataTableRouteMixin from 'frontend-loket/mixins/ember-data-table/route';
import { inject as service } from '@ember/service';
import { getUniqueBestuursorganen } from 'frontend-loket/models/mandataris';
import { hash } from 'rsvp';
import moment from 'moment';

const LIFETIME_BOARD_POSITION_URI =
  'http://data.vlaanderen.be/id/concept/BestuursfunctieCode/5972fccd87f864c4ec06bfbd20b5008b';

const NO_PROVENANCE_VENDOR_ID = 'none';

async function getActivePeriodsLabel(mandataris) {
  const mandate = await mandataris.bekleedt;
  const bestuursfunctie = await mandate.bestuursfunctie;

  if (bestuursfunctie.uri === LIFETIME_BOARD_POSITION_URI) {
    return 'Dit mandaat is een permanent mandaat.';
  }
  
  const bestuursorganenInTijd = await mandate.bevatIn;

  const ranges = bestuursorganenInTijd
    .map((b) => ({
      startDate: moment(b.bindingStart).format('YYYY-MM-DD'),
      endDate: b.bindingEinde
        ? moment(b.bindingEinde).format('YYYY-MM-DD')
        : null,
    }))
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .map(
      (p) =>
        `${moment(p.startDate).format('YYYY')}-${p.endDate ? moment(p.endDate).format('YYYY') : 'heden'}`,
    );

  if (!ranges.length) return '';
  return `Dit mandaat loopt over de volgende bestuursperiodes: ${ranges.join(', ')}.`;
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
    active: { refreshModel: true },
  };

  modelName = 'worship-mandatee';

  beforeModel() {
    const mandatenbeheer = this.modelFor('eredienst-mandatenbeheer');
    this.mandatenbeheer = mandatenbeheer;
  }

  async afterModel(mandatarissen) {
    let mandatarisBestuursorganen = mandatarissen.reduce((data, mandataris) => {
      data[mandataris.id] = getUniqueBestuursorganen(mandataris);
      return data;
    }, {});

    let mandatarisActivePeriods = mandatarissen.reduce((data, mandataris) => {
      data[mandataris.id] = getActivePeriodsLabel(mandataris);
      return data;
    }, {});

    this.mandatarisBestuursorganen = await hash(mandatarisBestuursorganen);
    this.mandatarisActivePeriods = await hash(mandatarisActivePeriods);
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

    if (params.active) {
      queryParams['filter'][':or:'] = {
        ':has-no:einde': true, //TODO: note, from the doc I thought it would only work with relations. But it seems to work.
        ':gt:einde': moment().toISOString(),
      };
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
    controller.mandatarisActivePeriods = this.mandatarisActivePeriods;
  }
}
