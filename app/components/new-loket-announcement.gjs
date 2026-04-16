import AuAlert from '@appuniversum/ember-appuniversum/components/au-alert';
import Component from '@glimmer/component';
import config from 'frontend-loket/config/environment';

const { title, message } = config.newLoketAnnouncement;

export default class NewLoketAnnouncement extends Component {
  get title() {
    return title.startsWith('{{') ? '' : title;
  }

  get message() {
    return message.startsWith('{{') ? '' : message;
  }

  get show() {
    return !title.startsWith('{{') || !message.startsWith('{{');
  }

  <template>
    {{#if this.show}}
      <AuAlert
        @icon="message"
        @skin="success"
        @title={{this.title}}
        @closable={{true}}
      >
        {{!template-lint-disable no-triple-curlies}}
        {{{this.message}}}
      </AuAlert>
    {{/if}}
  </template>
}
