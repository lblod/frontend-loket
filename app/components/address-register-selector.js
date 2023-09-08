import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { task, restartableTask, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

export default class AddressRegisterSelectorComponent extends Component {
  @service addressRegister;
  @service store;

  @tracked addressSuggestion;

  sourceCrab;

  constructor() {
    super(...arguments);

    this.addressRegister.setup({ endpoint: '/adresses-register' });
    if (this.args.address) {
      let addressSuggestion = this.args.address;

      if (!this.addressRegister.isEmpty(addressSuggestion)) {
        this.addressSuggestion = addressSuggestion;
      }
    }
  }

  @task
  *selectSuggestion(addressSuggestion) {
    //this.args.onChange(null); // What is the point of this? (Code was copied from OP)
    this.addressSuggestion = addressSuggestion;

    if (addressSuggestion) {
      const addresses = yield this.addressRegister.findAll(addressSuggestion);

      // if (!this.sourceCrab) {
      //   this.sourceCrab = yield this.store.findRecord(
      //     'concept',
      //     'e59c97a9-4e95-4d65-9696-756de47fbc1f'
      //   );
      // }
      // TODO: This code was copied from OP but the required concept does not exist.
      this.args.onChange({
        // source: this.sourceCrab,
        addresses: [
          ...new Map(
            addresses.map((a) => [
              `${a.street}${a.housenumber}${a.busNumber}`,
              a,
            ])
          ).values(),
        ],
      });
    }
  }

  @restartableTask
  *search(searchData) {
    yield timeout(400);
    const addressSuggestions = yield this.addressRegister.suggest(searchData);
    return addressSuggestions;
  }
}
