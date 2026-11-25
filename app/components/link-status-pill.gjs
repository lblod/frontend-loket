import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { modifier } from 'ember-modifier';
import { restartableTask } from 'ember-concurrency';
import AuPill from '@appuniversum/ember-appuniversum/components/au-pill';

export default class LinkStatusPill extends Component {
  @tracked isReachable = null;

  // Re-runs automatically whenever @url changes
  checkOnUrlChange = modifier((element, [url]) => {
    if (url) this.check.perform(url);
  });

  check = restartableTask(async (url) => {
    this.isReachable = null;
    try {
      const response = await fetch('/check-link/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error(`Link check failed: HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('result', result);
      this.isReachable = result.status;
    } catch (error) {
      console.error('Could not check link:', error);
    }
  });

  get skin() {
    if (this.check.isRunning) return 'default';
    if (this.isReachable === true) return 'success';
    if (this.isReachable === false) return 'error';
    return 'default';
  }
  get statusText() {
    if (this.check.isRunning) return 'Bereikbaarheid controleren...';
    if (this.isReachable === true) return 'De link is bereikbaar';
    if (this.isReachable === false) return 'De link is niet bereikbaar';
    return 'Bereikbaarheid kon niet gecontroleerd worden';
  }

  <template>
    {{#if @url}}
      <AuPill
        @icon="info-circle"
        @skin={{this.skin}}
        {{this.checkOnUrlChange @url}}
      >
        {{this.statusText}}
      </AuPill>
    {{/if}}
  </template>
}
