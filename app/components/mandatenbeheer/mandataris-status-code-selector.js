import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class MandatenbeheerMandatarisStatusCodeSelectorComponent extends Component {
  @service() store;

  @tracked statusCodeList;

  constructor(){
    super(...arguments);
    this.initStatusCodeList();
  }

  async initStatusCodeList() {
    const statusCodeList = await this.store.query('mandataris-status-code', { sort: 'label' });

    this.statusCodeList = statusCodeList;
  }

  @action
    select(code){
      this.args.onSelect(code);
    }
}
