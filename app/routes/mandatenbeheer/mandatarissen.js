import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DataTableRouteMixin from 'ember-data-table/mixins/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(DataTableRouteMixin, {
  currentSession: service(),
  modelName: 'mandataris',

  getBestuursorganen: async function(bestuurseenheidId){
    let bestuursorganen = await this.get('store').query('bestuursorgaan', {'filter[bestuurseenheid][id]': bestuurseenheidId });
    let organenInTijd = await Promise.all(bestuursorganen.map(orgaan => this.getLastBestuursorgaanInTijd(orgaan.get('id'))));
    return organenInTijd.filter(orgaan => orgaan);
  },

  getLastBestuursorgaanInTijd: async function(bestuursorgaanId){
    let queryParams = {
      'sort': '-binding-start',
      'filter[is-tijdsspecialisatie-van][id]': bestuursorgaanId
    };

    let organen = await this.get('store').query('bestuursorgaan', queryParams);
    return organen.firstObject;
  },

  async beforeModel(){
    let bestuurseenheid = await this.get('currentSession.group');
    this.set('bestuurseenheid', bestuurseenheid);
    let bestuursorganen = await this.getBestuursorganen(bestuurseenheid.get('id'));
    this.set('bestuursorganenIds', bestuursorganen.map(o => o.get('id')));
  },

  mergeQueryOptions(params){
    let queryParams = {
      sort: params.sort,
      filter: {
        'bekleedt': {
          'bevat-in': {
            'id': this.get('bestuursorganenIds').join(',')
          }
        }
      },
      include: [
        'is-bestuurlijke-alias-van',
        'is-bestuurlijke-alias-van.is-kandidaat-voor',
        'bekleedt',
        'bekleedt.bestuursfunctie',
        'bekleedt.bevat-in.is-tijdsspecialisatie-van',
        'bekleedt.bevat-in.is-tijdsspecialisatie-van.classificatie',
        'heeft-lidmaatschap',
        'heeft-lidmaatschap.binnen-fractie',
        'beleidsdomein'
      ].join(',')
    };

    if(params.filter){
      queryParams['filter']['is-bestuurlijke-alias-van'] = params.filter;
    }

    return queryParams;
  },

  async setupController(controller, model){
    this._super(controller, model);
    controller.set('bestuurseenheid', this.get('bestuurseenheid'));
  }
});
