import AuLoader from '@appuniversum/ember-appuniversum/components/au-loader';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import PowerSelect from 'ember-power-select/components/power-select';
import {
  CONCEPT_STATUS,
  SENT_STATUS,
} from 'frontend-loket/models/submission-document-status';

export default class SubmissionStatusSelect extends Component {
  @service store;
  @tracked statuses = [];

  constructor() {
    super(...arguments);

    this.loadStatuses();
  }

  get isLoading() {
    return this.statuses.length === 0;
  }

  get selectedStatus() {
    const { statusUri } = this.args;
    if (statusUri && !this.isLoading) {
      return this.statuses.find((status) => status.uri === statusUri);
    }

    return null;
  }

  async loadStatuses() {
    // We only want the concept and sent statuses for now, since those are the only ones visible in the table
    this.statuses = (
      await Promise.all([
        this.store.query('submission-document-status', {
          'filter[:uri:]': CONCEPT_STATUS,
          page: { size: 1 },
        }),
        this.store.query('submission-document-status', {
          'filter[:uri:]': SENT_STATUS,
          page: { size: 1 },
        }),
      ])
    ).map((statusResponse) => statusResponse.at(0));
  }

  handleChange = (maybeStatus) => {
    this.args.onChange?.(maybeStatus?.uri);
  };

  <template>
    <div ...attributes>
      {{#if this.isLoading}}
        <AuLoader
          @hideMessage={{true}}
          class="au-u-flex au-u-flex--center au-u-flex--vertical-center h-full"
        >Aan het laden</AuLoader>
      {{else}}
        <PowerSelect
          @options={{this.statuses}}
          @onChange={{this.handleChange}}
          @placeholder="Status"
          @ariaLabel="Filter op status"
          @selected={{this.selectedStatus}}
          @allowClear={{true}}
          as |status|
        >
          {{status.label}}
        </PowerSelect>
      {{/if}}
    </div>
  </template>
}
