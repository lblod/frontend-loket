import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import AuCheckbox from '@appuniversum/ember-appuniversum/components/au-checkbox';
import AuHelpText from '@appuniversum/ember-appuniversum/components/au-help-text';
import AuLinkExternal from '@appuniversum/ember-appuniversum/components/au-link-external';
import AuLoader from '@appuniversum/ember-appuniversum/components/au-loader';
import AuModal from '@appuniversum/ember-appuniversum/components/au-modal';
import AuTable from '@appuniversum/ember-appuniversum/components/au-table';
import { SearchIcon } from '@appuniversum/ember-appuniversum/components/icons/search';
import { NavLeftIcon } from '@appuniversum/ember-appuniversum/components/icons/nav-left';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { task } from 'ember-concurrency';
import eq from 'ember-truth-helpers/helpers/eq';
import not from 'ember-truth-helpers/helpers/not';
import { prefLabel } from 'frontend-loket/rdf/predicates';
import { ConceptSchemeSelect } from './concept-scheme-select';
import { extractDocumentsFromTtl } from './utils';
import momentFormat from 'ember-moment/helpers/moment-format';

export class AddDocumentsModal extends Component {
  @tracked org;
  @tracked selectedDocuments = [];
  @tracked searchMode = false;

  get shouldSelectOrg() {
    return !this.org;
  }

  get orgName() {
    if (!this.org) {
      return '';
    }

    return this.args.formStore.any(
      this.org,
      prefLabel,
      undefined,
      this.args.metaGraph,
    );
  }

  search = task(async () => {
    if (!this.org) {
      return;
    }

    this.searchMode = true;

    const url = new URL(
      '/worship-decisions-cross-reference/search-documents',
      // '/related-document-information',
      window.location.origin,
    );
    url.searchParams.append('forDecisionType', this.args.decisionType.uri);
    url.searchParams.append('forEenheid', this.org.uri);
    const response = await fetch(url);

    if (response.ok) {
      const ttlData = await response.text();

      if (ttlData.length > 0) {
        let data = extractDocumentsFromTtl(ttlData);

        data = data.filter((document) => {
          return !this.args.addedDocuments.some(
            (addedDocument) => addedDocument.node.uri === document.node.uri,
          );
        });
        data.sort((a, b) => b.sentDate - a.sentDate);

        return data;
      }
    } else {
      throw new Error(
        'Something went wrong while searching for related document information',
      );
    }
  });

  handleSelectionChange = (document, selected) => {
    if (selected) {
      this.selectedDocuments = [...this.selectedDocuments, document];
    } else {
      this.selectedDocuments = this.selectedDocuments.filter(
        (selected) => selected !== document,
      );
    }
  };

  <template>
    {{!Disabling this rule here makes the code easier to read}}
    {{! template-lint-disable no-negated-condition}}
    {{#if (not this.searchMode)}}
      <AuModal @modalOpen={{true}} @closeModal={{@onClose}} @overflow={{true}}>
        <:title>Documenten zoeken</:title>
        <:body>
          <ConceptSchemeSelect
            @formStore={{@formStore}}
            @metaGraph={{@metaGraph}}
            @conceptScheme={{@eenheidConceptScheme}}
            @selected={{this.org}}
            @required={{true}}
            @onChange={{fn (mut this.org)}}
          >
            <:label>Ingezonden door</:label>
          </ConceptSchemeSelect>
        </:body>
        <:footer>
          <div class="au-u-text-right">
            <AuButton
              @icon={{SearchIcon}}
              @disabled={{this.shouldSelectOrg}}
              {{on "click" this.search.perform}}
            >
              Documenten zoeken
            </AuButton>
          </div>
        </:footer>
      </AuModal>
    {{else}}
      <AuModal @modalOpen={{true}} @closeModal={{@onClose}}>
        <:title>Documenten toevoegen</:title>
        <:body>
          {{#if this.search.isIdle}}
            <div>
              <AuTable>
                <:title>
                  Ingezonden door "{{this.orgName}}"
                </:title>
                <:header>
                  <tr>
                    <th></th>
                    <th>Naam</th>
                    <th>Datum</th>
                  </tr>
                </:header>
                <:body>
                  {{#if this.search.last.isSuccessful}}
                    {{#each this.search.lastSuccessful.value as |document|}}
                      <tr>
                        <td>
                          <AuCheckbox
                            @checked={{arrayIncludes
                              this.selectedDocuments
                              document
                            }}
                            @onChange={{fn this.handleSelectionChange document}}
                          />
                        </td>
                        <td>
                          <AuLinkExternal href={{document.link}}>
                            {{document.name}}
                          </AuLinkExternal>
                        </td>
                        <td>{{momentFormat
                            document.sentDate
                            "DD-MM-YYYY H:mm"
                          }}</td>
                      </tr>
                    {{else}}
                      <tr>
                        <td colspan="3">
                          Geen resultaten
                        </td>
                      </tr>
                    {{/each}}
                  {{else}}
                    <tr>
                      <td colspan="3">
                        <AuHelpText
                          @error={{true}}
                          class="au-u-margin-top-none"
                        >
                          Er ging iets fout bij het zoeken naar documenten
                        </AuHelpText>
                      </td>
                    </tr>
                  {{/if}}
                </:body>
              </AuTable>
            </div>
          {{else}}
            <AuLoader>Documenten aan het laden</AuLoader>
          {{/if}}
        </:body>
        <:footer>
          <div class="au-u-flex au-u-flex--between">
            <AuButton
              @icon={{NavLeftIcon}}
              @skin="naked"
              {{on "click" (fn (mut this.searchMode) false)}}
            >
              Vorige
            </AuButton>

            <AuButton
              @disabled={{not this.selectedDocuments.length}}
              {{on "click" (fn @onAdd this.selectedDocuments)}}
            >
              {{#if (eq this.selectedDocuments.length 1)}}
                Document toevoegen
              {{else}}
                Documenten toevoegen
              {{/if}}
            </AuButton>
          </div>
        </:footer>
      </AuModal>
    {{/if}}
  </template>
}

/// Template helpers
function arrayIncludes(array, item) {
  return array.includes(item);
}
