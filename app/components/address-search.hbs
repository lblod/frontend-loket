{{#let @itemComponent (unique-id) as |Item id|}}
  {{#if this.isAddressSearchMode}}
    <Item
      @labelFor="{{id}}-address-search"
      @required={{@required}}
      @errorMessage={{if @error "Selecteer een adres"}}
      @alignTop={{true}}
    >
      <:label>Adres</:label>
      <:content as |errorMessage|>
        <AddressRegisterSelector
          @id="{{id}}-address-search"
          @address={{@address}}
          @onChange={{this.handleAddressChange}}
          @error={{errorMessage}}
        />
        {{#if errorMessage}}
          <AuHelpText @error={{true}}>{{errorMessage}}</AuHelpText>
        {{/if}}
        <p class="au-u-margin-top-tiny">
          <AuButton @skin="link" {{on "click" this.toggleInputMode}}>
            Vul adres manueel in
          </AuButton>
        </p>
      </:content>
      <:error>{{! Disable the default error message}}</:error>
    </Item>
    <Item
      @labelFor="{{id}}-address-search-bus-select"
      @required={{not this.isBusNumberSelectionDisabled}}
    >
      <:label>Busnummer</:label>
      <:content>
        <AddressRegisterBusNumberSelector
          @id="{{id}}-address-search-bus-select"
          @address={{this.addressWithBusNumber}}
          @options={{this.addressesWithBusNumbers}}
          @onChange={{this.handleBusNumberChange}}
          @disabled={{this.isBusNumberSelectionDisabled}}
          @placeholder={{if
            this.showBusNumbersNotAvailableMessage
            "Geen busnummer beschikbaar"
          }}
        />
        {{#if this.selectedAddress}}
          <AuHelpText>
            Staat het correcte busnummer niet in de lijst?
            <AuLinkExternal href="mailto:{{config 'contactEmail'}}">Mail ons</AuLinkExternal>
          </AuHelpText>
        {{/if}}
      </:content>
    </Item>
    {{yield to="commonInput"}}
  {{else}}
    {{yield to="manualAddressInputBeforeButton"}}
    <Item>
      <:content>
        <AuButton @skin="link" {{on "click" this.toggleInputMode}}>
          Vind adres in lijst
        </AuButton>
      </:content>
    </Item>
    {{yield to="manualAddressInput"}}
    {{yield to="commonInput"}}
  {{/if}}
{{/let}}