import Route from '@ember/routing/route';

export default Route.extend({
  async model(params) {
    let models =  (await this.store.query('form-solution',
                                                 {'filter[inzending-voor-toezicht][id]': params.id,
                                                  include: ['inzending-voor-toezicht.status',
                                                            'inzending-voor-toezicht.last-modifier',
                                                            'inzending-voor-toezicht.bestuurseenheid',
                                                            'inzending-voor-toezicht.inzending-type',
                                                            'inzending-voor-toezicht.besluit-type',
                                                            'inzending-voor-toezicht.bestuursorgaan',
                                                            'inzending-voor-toezicht.tax-rates',
                                                            'inzending-voor-toezicht.file-addresses'
                                                           ].join(',')}));
    return models.firstObject;
  }
});
