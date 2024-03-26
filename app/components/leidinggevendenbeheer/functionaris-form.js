import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class LeidinggevendenbeheerFunctionarisFormComponent extends Component {
  @service() store;

  @tracked statusOptions;

  constructor() {
    super(...arguments);
    this.getBestuursInfo();
  }

  get isValid() {
    return Boolean(this.args.model.start);
  }

  @action
  handleDateChange(attributeName, isoDate, date) {
    this.args.model[attributeName] = date;
  }

  @action
  handleStatusChange(statusId) {
    this.args.model.status = this.store.peekRecord(
      'functionaris-status-code',
      statusId,
    );
  }

  async getBestuursInfo() {
    const bestuursfunctie = await this.args.model.get('bekleedt');
    const bestuursfunctieCode = await bestuursfunctie.rol;

    let queryParams = {};
    if (bestuursfunctieCode.isLeidinggevendAmbtenaar) {
      queryParams = {
        filter: {
          ':uri:':
            'http://data.vlaanderen.be/id/concept/functionarisStatusCode/45b4b155-d22a-4eaf-be3a-97022c6b7fcd',
        }, // aangesteld
      };
    } else {
      queryParams = {
        sort: 'label',
        page: { size: 100 },
      };
    }

    const statusOptions = await this.store.query(
      'functionaris-status-code',
      queryParams,
    );
    this.statusOptions = statusOptions;
  }
}
