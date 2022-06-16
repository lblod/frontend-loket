import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class MandatenbeheerMandatarisStatusCodeSelectorComponent extends Component {
  @service() store;

  @tracked selectedStatusCode;
  @tracked statusCodeList;

  constructor() {
    super(...arguments);
    this.selectedStatusCode = this.args.statusCode;
    this.statusCodeList = this.store.query('mandataris-status-code', {
      sort: 'label',
    });
  }

  @action
  select(code) {
    this.selectedStatusCode = code;
    this.args.onSelect(code);
  }
}
