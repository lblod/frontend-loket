import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MandatenbeheerMandaatBestuursorganenSelectorComponent extends Component {
  @service store;

  @tracked mandaten;

  get bestuursorganen() {
    return this.args.bestuursorganen;
  }

  constructor() {
    super(...arguments);
    this.initMandaten();
  }

  async initMandaten() {
    const mandaten = await this.store.query('mandaat', {
      sort: 'bestuursfunctie.label',
      include: 'bestuursfunctie',
      'filter[bevat-in][id]': this.bestuursorganen.map(o => o.get('id')).join(',')
    });
    this.mandaten = mandaten;
  }

  @action
  select(mandaat) {
    this.args.onSelect(mandaat);
  }
}
