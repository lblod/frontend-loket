import {
  AuDropdown,
  AuPill,
  AuLink,
  AuButton,
} from '@appuniversum/ember-appuniversum';
import { LogoutIcon } from '@appuniversum/ember-appuniversum/components/icons/logout';
import { LoginIcon } from '@appuniversum/ember-appuniversum/components/icons/login';
import { SwitchIcon } from '@appuniversum/ember-appuniversum/components/icons/switch';
import { UserIcon } from '@appuniversum/ember-appuniversum/components/icons/user';
import { on } from '@ember/modifier';
import { service } from '@ember/service';
import Component from '@glimmer/component';

// TODO: Appuniversum doesn't ship these icons yet, but they come from the official Webuniversum Figma. Remove these once all the icons are added to Appuniversum: https://github.com/appuniversum/ember-appuniversum/issues/482
const PlayIcon = <template>
  <svg ...attributes xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M19.985 11.741 5 20.482V3l14.985 8.741Zm-3.97 0L7 6.482V17l9.015-5.259Z" clip-rule="evenodd"/></svg>
</template>

const PauseIcon = <template>
  <svg ...attributes xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M7 3h2c1.103 0 2 .896 2 2v14c0 1.103-.897 2-2 2H7c-1.103 0-2-.897-2-2V5c0-1.104.897-2 2-2Zm0 2v14h2.001L9 5H7Zm10-2h-2c-1.103 0-2 .896-2 2v14c0 1.103.897 2 2 2h2c1.103 0 2-.897 2-2V5c0-1.104-.897-2-2-2Zm-2 2v14h2.001L17 5h-2Z" clip-rule="evenodd"/></svg>
</template>

export default class ImpersonationMenu extends Component {
  @service impersonation;

  get isImpersonating() {
    return this.impersonation.isImpersonating;
  }

  get icon() {
    return this.isImpersonating ? PauseIcon : PlayIcon;
  }

  get user() {
    if (!this.isImpersonating) {
      return null;
    }

    return this.impersonation.impersonatedAccount.gebruiker;
  }

  get adminLabel() {
    return this.isImpersonating ? `Admin: ${this.user.fullName}` : 'Admin';
  }

  stopImpersonation = async () => {
    await this.impersonation.stopImpersonation();
    window.location.reload();
  };

  <template>
    <div class="au-u-flex au-u-flex--vertical-center">
      <AuPill @icon={{UserIcon}}>{{this.adminLabel}}</AuPill>

      <AuDropdown
        @title="Simulatie opties"
        @hideText={{true}}
        @alignment="right"
        @icon={{this.icon}}
        class="au-u-margin-left-tiny"
        role="menu"
      >
        {{#if this.isImpersonating}}
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
    </div>
  </template>
}
