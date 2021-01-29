import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import { A } from '@ember/array';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MandatenbeheerPersoonSearchFormComponent extends Component {
  @service store;

  @tracked pageSize = 20;
  @tracked showDefaultHead = true
  @tracked queryParams;
  @tracked error;
  @tracked page;

  @tracked personen;
  @tracked achternaam;
  @tracked gebruikteVoornaam;
  @tracked identificator;


  get searchTerms() {
    return [this.gebruikteVoornaam, this.achternaam, this.identificator].filter( t => t ).join(', ');
  }

  get isQuerying() {
    return this.search.isRunning || this.getPersoon.isRunning;
  }

  get hasSearched() {
    return this.search.performCount > 0;
  }

  constructor(){
    super(...arguments);
    this.personen = A();
  }

  @task(function* () {
    yield timeout(300);

    if(!(this.achternaam || this.gebruikteVoornaam || this.identificator)){
      this.queryParams = {};
      this.personen = [];
      return;
    }

    let queryParams = {
      sort:'achternaam',
      include: ['geboorte',
                'identificator'].join(','),
      filter: {
        achternaam: this.achternaam || undefined,
        'gebruikte-voornaam': this.gebruikteVoornaam || undefined,
        identificator:  this.identificator && this.identificator.replace(/\D+/g, "") || undefined
      },
      page:{
        size: this.pageSize,
        number: 0
      }
    };
    this.queryParams = queryParams;
    this.personen = yield this.getPersoon.perform(queryParams);
  }).restartable() search;

  @task(function* (queryParams){
    try {
      return yield this.store.query('persoon', queryParams);
    }
    catch(e){
      this.error = true;
    }
  }) getPersoon;

  resetAfterError(){
    this.error = false;
    this.search.cancelAll({ resetState: true });
  }

  @action
    async selectPage(page){
      this.page = page;
      let queryParams = this.queryParams;
      queryParams['page'] = {number: page};
      this.personen = await this.getPersoon.perform(queryParams);
    }

  @action
    selectPersoon(persoon){
      this.args.onSelect(persoon);
    }

  @action
    cancel(){
      this.args.onCancel();
    }

  @action
    toggleError(){
      this.resetAfterError();
    }
}
