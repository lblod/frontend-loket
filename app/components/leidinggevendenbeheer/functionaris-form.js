import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { notEmpty } from '@ember/object/computed';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class LeidinggevendenbeheerFunctionarisFormComponent extends Component {
  @service() store;

  @tracked statusOptions;
  @notEmpty('args.model.start') isValid;

  constructor() {
    super(...arguments);
    this.getBestuursInfo();
  }

  @action
  handleDateChange(attributeName, isoDate, date) {
    this.args.model[attributeName] = date;
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
      queryParams
    );
    this.statusOptions = statusOptions;
  }
}
