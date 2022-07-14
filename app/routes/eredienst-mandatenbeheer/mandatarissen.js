import Route from '@ember/routing/route';
// eslint-disable-next-line ember/no-mixins
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default class EredienstMandatenbeheerMandatarissenRoute extends Route.extend(
  DataTableRouteMixin
) {
  modelName = 'worship-mandatee';

  beforeModel() {
    const mandatenbeheer = this.modelFor('eredienst-mandatenbeheer');
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
      include: [
        'type-half',
        'bekleedt',
        'is-bestuurlijke-alias-van',
        'bekleedt.bestuursfunctie',
      ].join(','),
    };


    return queryParams;
  }
  }
}
