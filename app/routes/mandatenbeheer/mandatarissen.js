import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default Route.extend(DataTableRouteMixin, {
  modelName: 'mandataris',

  beforeModel(){
    const mandatenbeheer = this.modelFor('mandatenbeheer');
    this.set('mandatenbeheer', mandatenbeheer);
  },

  mergeQueryOptions(params){
    const bestuursorganenIds = this.mandatenbeheer.bestuursorganen.map(o => o.get('id'));

    const queryParams = {
      sort: params.sort,
      filter: {
        bekleedt: {
          'bevat-in': {
            id: bestuursorganenIds.join(',')
          }
        }
      },
      include: [
        'is-bestuurlijke-alias-van',
        'bekleedt.bestuursfunctie'
      ].join(',')
    };

    if(params.filter){
      queryParams['filter']['is-bestuurlijke-alias-van'] = params.filter;
    }

    return queryParams;
  },

  setupController(controller, model){
    this._super(controller, model);
    controller.set('searchData', this.paramsFor('mandatenbeheer.mandatarissen')['filter']);
    controller.set('mandatenbeheer', this.mandatenbeheer);
  },

  actions: {
    reloadModel(){
      this.refresh();
    }
  }
});
