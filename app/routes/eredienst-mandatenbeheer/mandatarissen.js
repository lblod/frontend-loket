import Route from '@ember/routing/route';
// eslint-disable-next-line ember/no-mixins
import DataTableRouteMixin from 'ember-data-table/mixins/route';
import { inject as service } from '@ember/service';
import { getUniqueBestuursorganen } from 'frontend-loket/models/mandataris';
import { hash } from 'rsvp';

export default class EredienstMandatenbeheerMandatarissenRoute extends Route.extend(
  DataTableRouteMixin,
) {
  @service store;

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

    this.mandatarisBestuursorganen = await hash(mandatarisBestuursorganen);
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
      ].join(','),
    };

    if (params.filter) {
      queryParams['filter']['is-bestuurlijke-alias-van'] = params.filter;
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
  }
}
