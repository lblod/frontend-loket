/* eslint-disable ember/no-mixins */
import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default class MandatenbeheerMandatarissenRoute extends Route.extend(
  DataTableRouteMixin
) {
  @service store;

  modelName = 'mandataris';

  beforeModel() {
    const mandatenbeheer = this.modelFor('mandatenbeheer');
    this.mandatenbeheer = mandatenbeheer;
  }

  mergeQueryOptions(params) {
    const bestuursorganenIds = this.mandatenbeheer.bestuursorganen.map((o) =>
      o.get('id')
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
      include: ['is-bestuurlijke-alias-van', 'bekleedt.bestuursfunctie'].join(
        ','
      ),
    };

    if (params.filter) {
      queryParams['filter']['is-bestuurlijke-alias-van'] = params.filter;
    }

    return queryParams;
  }

  setupController(controller) {
    super.setupController(...arguments);
    controller.searchData = this.paramsFor('mandatenbeheer.mandatarissen')[
      'filter'
    ];
    controller.mandatenbeheer = this.mandatenbeheer;
  }

  @action
  reloadModel() {
    this.refresh();
  }
}
