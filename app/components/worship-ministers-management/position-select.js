import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class WorshipMinistersManagementPositionSelectComponent extends Component {
  @service store;

  constructor() {
    super(...arguments);

    this.optionsPromise = this.loadMinisterPositions();
  }

  async loadMinisterPositions() {
    return this.store.query('minister-position', {
      'filter[worship-service][:uri:]': this.args.worshipService.uri,
      include: 'function',
    });
  }
}
