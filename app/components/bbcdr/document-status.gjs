import AuPill from '@appuniversum/ember-appuniversum/components/au-pill';
import { capitalize } from '@ember/string';
import Component from '@glimmer/component';
import { DOCUMENT_STATUS } from 'frontend-loket/models/document-status';

export default class DocumentStatus extends Component {
  get skin() {
    const STATUS_SKIN = {
      [DOCUMENT_STATUS.CONCEPT]: 'border',
      [DOCUMENT_STATUS.GOEDGEKEURD]: 'success',
      [DOCUMENT_STATUS.OPMERKING]: 'warning',
      [DOCUMENT_STATUS.VERSTUURD]: 'action',
    };

    return STATUS_SKIN[this.args.status?.uri];
  }

  <template>
    <AuPill
      @skin={{this.skin}}
      resource={{@status.uri}}
      data-test-loket="document-status-pill"
    >
      {{#if @status.label}}
        {{capitalize @status.label}}
      {{/if}}
    </AuPill>
  </template>
}
