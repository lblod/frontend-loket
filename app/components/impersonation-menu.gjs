import {
  AuDropdown,
  AuPill,
  AuLink,
  AuButton,
} from '@appuniversum/ember-appuniversum';
import { LogoutIcon } from '@appuniversum/ember-appuniversum/components/icons/logout';
import { LoginIcon } from '@appuniversum/ember-appuniversum/components/icons/login';
import { NotVisibleIcon } from '@appuniversum/ember-appuniversum/components/icons/not-visible';
import { SwitchIcon } from '@appuniversum/ember-appuniversum/components/icons/switch';
// import { VisibleIcon } from '@appuniversum/ember-appuniversum/components/icons/visible';
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
      @title="Simulatie opties"
      @hideText={{true}}
      @alignment="right"
      {{!-- TODO: Use the VisibleIcon component once the issue is resolved: https://github.com/appuniversum/ember-appuniversum/issues/482#issuecomment-2022446973 --}}
      @icon={{if this.impersonation.isImpersonating "visible" NotVisibleIcon}}
      {{!-- @icon={{if this.impersonation.isImpersonating VisibleIcon NotVisibleIcon}} --}}
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

        <AuLink @route="impersonate" @icon={{SwitchIcon}} role="menuitem">
          Simuleer een andere bestuurseenheid
        </AuLink>

        <AuButton
          @skin="link"
          @icon={{LogoutIcon}}
          role="menuitem"
          {{on "click" this.stopImpersonation}}
        >
          Simulatie stopzetten
        </AuButton>
      {{else}}
        <AuLink @route="impersonate" @icon={{LoginIcon}} role="menuitem">
          Simuleer een bestuurseenheid
        </AuLink>
      {{/if}}
    </AuDropdown>
  </template>
}
