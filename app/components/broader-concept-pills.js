import Component from '@glimmer/component';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { keepLatestTask } from 'ember-concurrency';

export default class BroaderConceptPillsComponent extends Component {
  @service store;

  @tracked concept;

  constructor() {
    super(...arguments);
    this.loadData.perform();
  }

  loadData = keepLatestTask(async () => {
    this.concept = await this.store.findRecordByUri('concept', this.args.uri);
  });
}
