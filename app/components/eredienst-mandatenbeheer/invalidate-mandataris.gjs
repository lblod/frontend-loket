import momentFormat from 'ember-moment/helpers/moment-format';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import AuContent from '@appuniversum/ember-appuniversum/components/au-content';
import AuLabel from '@appuniversum/ember-appuniversum/components/au-label';
import AuModal from '@appuniversum/ember-appuniversum/components/au-modal';
import AuTextarea from '@appuniversum/ember-appuniversum/components/au-textarea';
import { assert } from '@ember/debug';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import PowerSelect from 'ember-power-select/components/power-select';
import withValue from 'frontend-loket/helpers/with-value';
import { INVALIDATION_REASON } from 'frontend-loket/models/concept';

export default class InvalidateMandataris extends Component {
  @service store;
  @tracked invalidationReason = '';
  @tracked duplicateOf;

  get isDelete() {
    return this.args.invalidationType === INVALIDATION_REASON.INVALID;
  }

  get duplicateOptions() {
    return this.args.mandatarissen.filter(
      (mandataris) =>
        mandataris.id !== this.args.mandataris.id && !mandataris.invalidation,
    );
  }

  async markAsDuplicate() {
    assert('A duplicate should have been selected already', this.duplicateOf);
    await this.addInvalidation(this.args.mandataris, {
      seeAlso: this.duplicateOf.uri,
    });
  }

  async softDelete() {
    await this.addInvalidation(this.args.mandataris);
  }

  async addInvalidation(mandataris, data) {
    const invalidation = this.store.createRecord('invalidation', {
      time: new Date(),
      type: this.args.invalidationType,
      ...data,
    });

    if (this.invalidationReason.trim() !== '') {
      invalidation.comment = this.invalidationReason.trim();
    }

    await invalidation.save();
    mandataris.invalidation = invalidation;
    await mandataris.save();
  }

  onSubmit = task(async () => {
    if (this.isDelete) {
      await this.softDelete();
    } else {
      await this.markAsDuplicate();
    }
    this.args.onComplete?.();
  });

  <template>
    <AuModal @modalOpen={{true}} @closeModal={{@onCancel}}>
      <:title>{{if
          this.isDelete
          "Mandataris verwijderen"
          "Markeren als duplicaat"
        }}</:title>
      <:body>
        <AuContent class="au-u-margin-bottom">
          <p>
            {{#if this.isDelete}}
              Na het verwijderen
            {{else}}
              Na het markeren als duplicaat
            {{/if}}
            zal deze mandataris niet meer zichtbaar zijn voor gebruikers. Als
            admin kan je deze wel nog steeds terugvinden door de "Toon verborgen
            mandatarissen" filter te gebruiken.
          </p>
        </AuContent>

        {{#unless this.isDelete}}
          <AuLabel for="duplicate-of">Originele mandataris</AuLabel>
          <PowerSelect
            @selected={{this.duplicateOf}}
            @options={{this.duplicateOptions}}
            @onChange={{fn (mut this.duplicateOf)}}
            class="au-u-margin-bottom"
            as |mandatarisOption|
          >
            {{mandatarisOption.isBestuurlijkeAliasVan.gebruikteVoornaam}}
            {{mandatarisOption.isBestuurlijkeAliasVan.achternaam}}
            -
            {{mandatarisOption.bekleedt.bestuursfunctie.label}}
            ({{momentFormat mandatarisOption.start "DD-MM-YYYY"}}
            -
            {{momentFormat mandatarisOption.einde "DD-MM-YYYY"}})
          </PowerSelect>
        {{/unless}}

        <AuLabel for="invalidation-reason">Reden</AuLabel>
        <AuTextarea
          @width="block"
          rows="4"
          id="invalidation-reason"
          {{on "input" (withValue (fn (mut this.invalidationReason)))}}
        />
      </:body>
      <:footer>
        {{#if this.isDelete}}
          <AuButton
            @alert={{true}}
            @icon="bin"
            @loading={{this.onSubmit.isRunning}}
            @loadingMessage="Verwijderen"
            {{on "click" this.onSubmit.perform}}
          >
            Verwijderen
          </AuButton>
        {{else}}
          <AuButton
            @icon="copy"
            @loading={{this.onSubmit.isRunning}}
            @loadingMessage="Markeren als duplicaat"
            @disabled={{if this.duplicateOf false true}}
            {{on "click" this.onSubmit.perform}}
          >
            Markeren als duplicaat
          </AuButton>
        {{/if}}
        <AuButton @skin="naked" {{on "click" @onCancel}}>Annuleer</AuButton>
      </:footer>
    </AuModal>
  </template>
}
