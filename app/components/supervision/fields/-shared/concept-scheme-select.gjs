import AuLabel from '@appuniversum/ember-appuniversum/components/au-label';
import AuHelpText from '@appuniversum/ember-appuniversum/components/au-help-text';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import PowerSelect from 'ember-power-select/components/power-select';
import { SKOS } from '@lblod/submission-form-helpers';
import { NamedNode } from 'rdflib';

const prefLabel = SKOS('prefLabel');

// Based on the ember-submission-form-fields version
export class ConceptSchemeSelect extends Component {
  @tracked options = this.getOptions();

  getOptions() {
    const metaGraph = this.args.metaGraph;
    const conceptSchemeUri = this.args.conceptScheme;
    const conceptScheme = new NamedNode(conceptSchemeUri);

    const options = this.args.formStore
      .match(undefined, SKOS('inScheme'), conceptScheme, metaGraph)
      .map((t) => {
        const label = this.args.formStore.any(
          t.subject,
          prefLabel,
          undefined,
          metaGraph,
        );
        return { subject: t.subject, label: label?.value };
      });

    options.sort(byLabel);

    return options;
  }

  get hasError() {
    return Boolean(this.args.error);
  }

  get selected() {
    if (!this.args.selected) {
      return null;
    }

    return this.options.find((option) =>
      option.subject.equals(this.args.selected),
    );
  }

  handleChange = (option) => {
    this.args.onChange?.(option.subject);
  };

  <template>
    <div class={{if this.hasError "ember-power-select--error"}} ...attributes>
      <AuLabel @error={{this.hasErrors}} @required={{@required}}>
        {{yield to="label"}}
      </AuLabel>
      {{#if @isReadOnly}}
        {{this.selected.label}}
      {{else}}
        <PowerSelect
          @options={{this.options}}
          @selected={{this.selected}}
          @searchEnabled={{true}}
          @searchField="label"
          @onChange={{this.handleChange}}
          {{!-- @renderInPlace={{true}} --}}
          as |concept|
        >
          {{concept.label}}
        </PowerSelect>
      {{/if}}

      {{#if this.hasError}}
        <AuHelpText @error={{true}}>
          {{@error}}
        </AuHelpText>
      {{/if}}
    </div>
  </template>
}

// Source: https://github.com/lblod/ember-submission-form-fields/blob/5eb12a7794a70a04dfd1e8d392f0cc079d6aad72/addon/components/rdf-input-fields/concept-scheme-selector.js#L14C1-L18C2
function byLabel(a, b) {
  const textA = a.label.toUpperCase();
  const textB = b.label.toUpperCase();
  return textA < textB ? -1 : textA > textB ? 1 : 0;
}
