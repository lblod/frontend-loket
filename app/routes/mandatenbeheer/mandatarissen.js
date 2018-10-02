import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default Route.extend(DataTableRouteMixin, {
  modelName: 'mandataris',

  async beforeModel(){
    const mandatenbeheer = await this.modelFor('mandatenbeheer');
    this.set('bestuurseenheid', mandatenbeheer.bestuurseenheid);
    const bestuursorganen = mandatenbeheer.bestuursorganen;
    this.set('bestuursorganen', bestuursorganen);
    this.set('bestuursorganenIds', bestuursorganen.map(o => o.get('id')));
  },

  mergeQueryOptions(params){
    const queryParams = {
      sort: params.sort,
      filter: {
        bekleedt: {
          'bevat-in': {
            id: this.bestuursorganenIds.join(',')
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
    controller.set('bestuurseenheid', this.bestuurseenheid);
    controller.set('bestuursorganen', this.bestuursorganen);
  }
});
