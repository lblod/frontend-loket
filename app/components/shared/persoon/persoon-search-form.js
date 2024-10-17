import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { restartableTask, task, timeout } from 'ember-concurrency';
import { A } from '@ember/array';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class SharedPersoonPersoonSearchFormComponent extends Component {
  @service store;

  @tracked pageSize = 20;
  @tracked queryParams;
  @tracked error;
  @tracked page;

  @tracked personen;
  @tracked achternaam;
  @tracked voornaam;
  @tracked rijksregisternummer;

  get searchTerms() {
    return [this.voornaam, this.achternaam, this.rijksregisternummer]
      .filter((t) => t)
      .join(', ');
  }

  get isQuerying() {
    return this.search.isRunning || this.getPersoon.isRunning;
  }

  get hasSearched() {
    return this.search.performCount > 0;
  }

  get showDefaultHead() {
    return this.args.showDefaultHead ?? true;
  }

  constructor() {
    super(...arguments);
    this.personen = A();
  }

  @action
  updateSearchParam(paramField, event) {
    this[paramField] =
      paramField === 'rijksregisternummer'
        ? event.target.inputmask.unmaskedvalue()
        : event.target.value;

    this.search.perform();
  }

  @restartableTask
  *search() {
    yield timeout(300);

    if (!(this.achternaam || this.voornaam || this.rijksregisternummer)) {
      this.queryParams = {};
      this.personen = [];
      return;
    }

    let queryParams = {
      sort: 'achternaam',
      include: ['geboorte', 'identificator'].join(','),
      filter: {
        achternaam: this.achternaam || undefined,
        'gebruikte-voornaam': this.voornaam || undefined,
        identificator:
          (this.rijksregisternummer &&
            this.rijksregisternummer.replace(/\D+/g, '')) ||
          undefined,
      },
      page: {
        size: this.pageSize,
        number: 0,
      },
    };
    this.queryParams = queryParams;
    this.personen = yield this.getPersoon.perform(queryParams);
    if (this.personen.meta.pagination.self.number !== this.page) this.page = 0;
  }

  @task
  *getPersoon(queryParams) {
    try {
      return yield this.store.query('persoon', queryParams);
    } catch {
      this.error = true;
    }
  }

  resetAfterError() {
    this.error = false;
    this.search.cancelAll({ resetState: true });
  }

  @action
  async selectPage(page = 0) {
    this.page = page;
    let queryParams = this.queryParams;
    queryParams['page'] = { number: page };
    this.personen = await this.getPersoon.perform(queryParams);
  }

  @action
  selectPersoon(persoon) {
    this.args.onSelect(persoon);
  }

  @action
  cancel() {
    this.args.onCancel();
  }

  @action
  toggleError() {
    this.resetAfterError();
  }

  @action
  handleCreatePersonClick() {
    if (!(this.achternaam || this.voornaam || this.rijksregisternummer)) {
      this.args.onCreateNewPerson();
    } else {
      this.args.onCreateNewPerson({
        voornaam: this.voornaam,
        achternaam: this.achternaam,
        rijksregisternummer: this.rijksregisternummer,
      });
    }
  }
}
