import { service } from '@ember/service';
import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import PowerSelect from 'ember-power-select/components/power-select';

export default class MandaatBestuursorganenSelector extends Component {
  @service store;

  constructor() {
    super(...arguments);

    this.loadMandates.perform();
  }

  loadMandates = task(async () => {
    const mandaten = await this.store.query('mandaat', {
      sort: 'bestuursfunctie.label',
      include: 'bestuursfunctie',
      'filter[bevat-in][id]': this.args.bestuursorganen
        .map((o) => o.id)
        .join(','),
    });

    return mandaten;
  });

  <template>
    <div class={{if @error "ember-power-select--error"}}>
      <PowerSelect
        @loadingMessage="Aan het laden..."
        @noMatchesMessage="Geen resultaten"
        @searchMessage="Typ om te zoeken"
        @searchEnabled={{true}}
        @allowClear={{@allowClear}}
        @disabled={{@disabled}}
        @placeholder="Zoek mandaat"
        @options={{this.loadMandates.last.value}}
        @selected={{@mandaat}}
        @searchField="bestuursfunctie.label"
        @onChange={{@onSelect}}
        @triggerId="mandaat"
        as |mandaat|
      >
        {{mandaat.bestuursfunctie.label}}
      </PowerSelect>
    </div>
  </template>
}
