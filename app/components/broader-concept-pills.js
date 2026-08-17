import { assert } from '@ember/debug';
import Component from '@glimmer/component';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { keepLatestTask } from 'ember-concurrency';

export default class BroaderConceptPillsComponent extends Component {
  @service store;

  @tracked concept;
  @tracked parents;

  constructor() {
    super(...arguments);
    this.loadData.perform();
  }

  get label() {
    assert(
      'parents is expected to be loaded before we access it here.',
      Array.isArray(this.parents) && this.parents.length > 0,
    );
    return this.parents.at(0).label;
  }

  loadData = keepLatestTask(async () => {
    this.concept = await this.store.findRecordByUri('concept', this.args.uri);
    this.parents = await this.concept.broader;
  });
}
