import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import AuPill from '@appuniversum/ember-appuniversum/components/au-pill';
import AuAccordion from '@appuniversum/ember-appuniversum/components/au-accordion';
import AuLinkExternal from '@appuniversum/ember-appuniversum/components/au-link-external';

export default class LinkChecker extends Component {
  @tracked statusText = 'Bereikbaarheid controleren...';
  @tracked skin = 'default';
  @tracked hasChecked = false;

  @action
  async checkLink() {
    if (this.hasChecked && this.skin !== 'default') return;
    this.hasChecked = true;
    let linkStatus = 'unchecked';

    try {
      const response = await fetch('/check-link/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          url: this.args.url,
        }),
      });

      if (!response.ok) {
        console.log(response.url);
        throw new Error(`Link check failed: HTTP ${response.status}`);
      }

      const result = await response.json();
      linkStatus = result.status;
    } catch (error) {
      console.error('Could not check source link:', error);
    } finally {
      switch (linkStatus) {
        case 'alive':
          this.skin = 'success';
          this.statusText = 'De link is bereikbaar';
          break;
        case 'dead':
          this.skin = 'error';
          this.statusText = 'De link is niet bereikbaar';
          break;
        default:
          this.skin = 'default';
          this.statusText = 'Bereikbaarheid controleren...';
      }
    }
  }

  <template>
    <AuAccordion
      @buttonLabel="Bron"
      @reverse={{true}}
      {{on "click" this.checkLink}}
    >
      <AuLinkExternal
        @icon="external-link"
        href={{@url}}
      >
        {{@url}}
      </AuLinkExternal>

      <AuPill
        @skin={{this.skin}}
        @icon="info-circle"
      >
        {{this.statusText}}
      </AuPill>
    </AuAccordion>
  </template>
}
