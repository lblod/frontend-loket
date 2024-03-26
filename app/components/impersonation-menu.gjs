import {
  AuDropdown,
  AuPill,
  AuLink,
  AuButton,
} from '@appuniversum/ember-appuniversum';
import { on } from '@ember/modifier';
import { service } from '@ember/service';
import Component from '@glimmer/component';

export default class ImpersonationMenu extends Component {
  @service impersonation;

  stopImpersonation = async () => {
    await this.impersonation.stopImpersonation();
    window.location.reload();
  };

  <template>
    <AuDropdown
      @title="Bestuurseenheid imitatie opties"
      @hideText={{true}}
      @alignment="right"
      @icon={{if this.impersonation.isImpersonating "visible" "not-visible"}}
      @alert={{this.impersonation.isImpersonating}}
      class="au-u-margin-left-tiny"
      role="menu"
    >
      {{#if this.impersonation.isImpersonating}}
        <div role="menuitem">
          Je ziet de app als:
          <AuPill>
            {{this.impersonation.impersonatedAccount.gebruiker.voornaam}}
            {{this.impersonation.impersonatedAccount.gebruiker.achternaam}}
          </AuPill>
        </div>

        <AuLink @route="impersonate" @icon="switch" role="menuitem">
          Imiteer een andere bestuurseenheid
        </AuLink>

        <AuButton @skin="link" @icon="logout" role="menuitem" {{on "click" this.stopImpersonation}}>
          Stop met imiteren
        </AuButton>
      {{else}}
        <AuLink @route="impersonate" @icon="login" role="menuitem">
          Kies een bestuurseenheid om te imiteren
        </AuLink>
      {{/if}}
    </AuDropdown>
  </template>
}
