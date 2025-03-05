import AuHelpText from '@appuniversum/ember-appuniversum/components/au-help-text';
import AuLabel from '@appuniversum/ember-appuniversum/components/au-label';
import AuLinkExternal from '@appuniversum/ember-appuniversum/components/au-link-external';
import { hash } from '@ember/helper';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { keepLatestTask, task, timeout } from 'ember-concurrency';
import PowerSelect from 'ember-power-select/components/power-select';
import not from 'ember-truth-helpers/helpers/not';

export default class AddressSelector extends Component {
  @service addressRegister;

  @tracked addressSuggestion;
  @tracked addressesWithBusnumbers;
  @tracked addressWithBusnumber;

  constructor() {
    super(...arguments);
    this.addressRegister.setup({ endpoint: '/adressenregister' });
    this.getAddressInfo();
  }

  get isDisabledBusnumberSelect() {
    return !this.addressWithBusnumber;
  }

  async getAddressInfo() {
    const adresRecord = this.args.address;
    if (adresRecord) {
      this.addressSuggestion = {
        adresRegisterId: adresRecord.adresRegisterId,
        street: adresRecord.straatnaam,
        housenumber: adresRecord.huisnummer,
        zipCode: adresRecord.postcode,
        municipality: adresRecord.gemeentenaam,
        fullAddress: adresRecord.volledigAdres,
      };

      const addresses = await this.addressRegister.findAll(
        this.addressSuggestion,
      );

      if (addresses.length > 1) {
        const selectedAddress = addresses.find(
          (a) => a.busNumber == adresRecord.busnummer,
        );
        this.addressesWithBusnumbers = sortByBusnumber(addresses);
        this.addressWithBusnumber = selectedAddress;
      } else {
        this.addressesWithBusnumbers = null;
        this.addressWithBusnumber = null;
      }
    }
  }

  selectSuggestion = task(async (addressSuggestion) => {
    this.addressesWithBusnumbers = null;
    this.addressWithBusnumber = null;
    this.addressSuggestion = addressSuggestion;

    if (addressSuggestion) {
      const addresses = await this.addressRegister.findAll(addressSuggestion);
      if (addresses.length === 1) {
        this.args.onChange(addressToModelProperties(addresses[0]));
      } else {
        // selection of busnumber required
        const sortedBusNumbers = sortByBusnumber(addresses);
        this.addressesWithBusnumbers = sortedBusNumbers;
        this.addressWithBusnumber = sortedBusNumbers[0];
        this.args.onChange(addressToModelProperties(this.addressWithBusnumber));
      }
    } else {
      this.args.onChange(null);
    }
  });

  search = keepLatestTask(async (searchData) => {
    await timeout(400);
    const addressSuggestions = await this.addressRegister.suggest(searchData);
    return addressSuggestions;
  });

  @action
  selectAddressWithBusnumber(address) {
    this.addressWithBusnumber = address;
    this.args.onChange(addressToModelProperties(address));
  }

  <template>
    {{#if (not (has-block))}}
      <div class="au-u-2-3@medium">
        <AuLabel for="address">Adres</AuLabel>
        <PowerSelect
          @triggerId="address"
          @allowClear={{true}}
          @disabled={{this.disabled}}
          @search={{this.search.perform}}
          @selected={{this.addressSuggestion}}
          @onChange={{this.selectSuggestion.perform}}
          @loadingMessage="Aan het laden..."
          @searchEnabled={{true}}
          @noMatchesMessage="Geen resultaten"
          @searchMessage="Typ om te zoeken"
          as |suggestion|
        >
          {{suggestion.fullAddress}}
        </PowerSelect>
      </div>
      <div class="au-u-2-3@medium au-u-margin-top">
        <AuLabel for="busnumber">Busnummer</AuLabel>

        <BusnumberSelector
          @address={{this.addressWithBusnumber}}
          @options={{this.addressesWithBusnumbers}}
          @onChange={{this.selectAddressWithBusnumber}}
          @disabled={{this.isDisabledBusnumberSelect}}
          @allowClear={{false}}
        />
        <AuHelpText>
          Staat het correcte busnummer niet in de lijst?
          <AuLinkExternal href="mailto:LoketLokaalBestuur@vlaanderen.be">
            Mail ons
          </AuLinkExternal>
        </AuHelpText>
      </div>
    {{else}}
      {{yield
        (hash
          Selector=(component
            PowerSelect
            allowClear=true
            disabled=this.disabled
            search=this.search.perform
            selected=this.addressSuggestion
            onChange=this.selectSuggestion.perform
            loadingMessage="Aan het laden..."
            searchEnabled=true
            noMatchesMessage="Geen resultaten"
            searchMessage="Typ om te zoeken"
          )
          BusSelector=(component
            BusnumberSelector
            address=this.addressWithBusnumber
            options=this.addressesWithBusnumbers
            onChange=this.selectAddressWithBusnumber
            disabled=this.isDisabledBusnumberSelect
            allowClear=false
          )
        )
      }}
    {{/if}}
  </template>
}

/**
 * @param {{busNumber: string | null}[]} arrayToSort
 * @returns {{busNumber: string | null}[]}
 */
function sortByBusnumber(arrayToSort) {
  return arrayToSort.slice().sort((a, b) => {
    if (!a.busNumber) {
      return -1;
    }

    return a.busNumber.localeCompare(b.busNumber);
  });
}

const BusnumberSelector = <template>
  <PowerSelect
    @allowClear={{@allowClear}}
    @disabled={{@disabled}}
    @placeholder={{if @disabled "/"}}
    @selected={{@address}}
    @options={{@options}}
    @onChange={{@onChange}}
    @searchEnabled={{true}}
    @loadingMessage="Aan het laden..."
    @noMatchesMessage="Geen resultaten"
    as |address|
  >
    {{#if address.busNumber}}
      Bus
      {{address.busNumber}}
    {{else}}
      Geen busnummer
    {{/if}}
  </PowerSelect>
</template>;

function addressToModelProperties(address) {
  return {
    straatnaam: address.street,
    huisnummer: address.housenumber,
    busnummer: address.busNumber,
    postcode: address.zipCode,
    gemeentenaam: address.municipality,
    land: null,
    volledigAdres: address.fullAddress,
    adresRegisterId: address.adresRegisterId,
    adresRegisterUri: address.uri,
  };
}
