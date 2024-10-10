import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import AuHelpText from '@appuniversum/ember-appuniversum/components/au-help-text';
import AuIcon from '@appuniversum/ember-appuniversum/components/au-icon';
import AuLabel from '@appuniversum/ember-appuniversum/components/au-label';
import AuLinkExternal from '@appuniversum/ember-appuniversum/components/au-link-external';
import AuLoader from '@appuniversum/ember-appuniversum/components/au-loader';
import AuTable from '@appuniversum/ember-appuniversum/components/au-table';
import { AddIcon } from '@appuniversum/ember-appuniversum/components/icons/add';
import { BinIcon } from '@appuniversum/ember-appuniversum/components/icons/bin';
import { InfoCircleIcon } from '@appuniversum/ember-appuniversum/components/icons/info-circle';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { registerFormFields } from '@lblod/ember-submission-form-fields';
import { task } from 'ember-concurrency';
import worshipDecisionsDatabaseUrl from 'frontend-loket/helpers/worship-decisions-database-url';
import { RDF } from 'frontend-loket/rdf/namespaces';
import { formatDate } from 'frontend-loket/utils/date';
import { isRequiredField } from 'frontend-loket/utils/semantic-forms';
import { AddDocumentsModal } from './-shared/add-documents-modal';
import { extractDocumentsFromTtl } from './-shared/utils';

export function registerFormField() {
  registerFormFields([
    {
      displayType: 'http://lblod.data.gift/display-types/decisionDocuments',
      edit: DecisionDocumentsField,
    },
  ]);
}

/// Components
class DecisionDocumentsField extends Component {
  @tracked documents = [];
  @tracked showModal = false;

  constructor() {
    super(...arguments);

    this.loadDocuments.perform();
  }

  get isReadOnly() {
    return this.args.show;
  }

  get hasErrors() {
    return this.args.forceShowErrors && this.documents.length === 0;
  }

  get isRequired() {
    return (
      !this.isReadOnly &&
      isRequiredField(
        this.args.field.uri,
        this.args.formStore,
        this.args.graphs.formGraph,
      )
    );
  }

  get decisionType() {
    return this.args.formStore.any(
      this.args.sourceNode,
      RDF('type'),
      undefined,
      this.args.graphs.sourceGraph,
    );
  }

  get path() {
    return this.args.field.rdflibPath;
  }

  loadDocuments = task(async () => {
    // This is needed so the rest of the method happens _after_ the willDestroy method of previous component instances,
    // otherwise we would simply load the old data again before it was removed from the store.
    await Promise.resolve();

    const {
      formStore,
      sourceNode,
      graphs: { sourceGraph },
    } = this.args;

    const triples = formStore.match(
      sourceNode,
      this.args.field.rdflibPath,
      undefined,
      sourceGraph,
    );

    const documentPromises = triples.map(async (triple) => {
      const document = triple.object;

      const url = new URL(
        '/worship-decisions-cross-reference/document-information',
        window.location.origin,
      );

      url.searchParams.append('forDecisionType', this.decisionType.uri);
      url.searchParams.append('forRelatedDecision', document.uri);
      const response = await fetch(url);

      if (response.ok) {
        const ttlData = await response.text();

        if (ttlData.length > 0) {
          let data = extractDocumentsFromTtl(ttlData);

          return data.at(0);
        }
      } else {
        throw new Error(
          'Something went wrong while retrieving related document information',
        );
      }
    });

    this.documents = await Promise.all(documentPromises);
  });

  addDocuments = (documentsToAdd) => {
    this.documents = [...this.documents, ...documentsToAdd];

    const { formStore, graphs, sourceNode } = this.args;
    const statements = documentsToAdd.map((document) => {
      return {
        subject: sourceNode,
        predicate: this.path,
        object: document.node,
        graph: graphs.sourceGraph,
      };
    });

    formStore.addAll(statements);

    this.showModal = false;
  };

  removeDocument = (documentToRemove) => {
    this.documents = this.documents.filter(
      (document) => document !== documentToRemove,
    );

    const { formStore, graphs, sourceNode } = this.args;
    formStore.removeStatements([
      {
        subject: sourceNode,
        predicate: this.path,
        object: documentToRemove.node,
        graph: graphs.sourceGraph,
      },
    ]);
  };

  <template>
    <AuLabel
      @error={{this.hasErrors}}
      @required={{this.isRequired}}
      @warning={{this.hasWarnings}}
      for={{this.inputId}}
    >
      {{@field.label}}
    </AuLabel>

    <AuHelpText @skin="secondary" class="au-u-margin-bottom-small">
      <AuIcon @icon={{InfoCircleIcon}} />
      Voor een vlotte raadpleging van de gerefereerde documenten, raden we aan
      om eerst aan te loggen op
      <AuLinkExternal
        @skin="secondary"
        href={{(worshipDecisionsDatabaseUrl)}}
      >Databank Erediensten</AuLinkExternal>
    </AuHelpText>

    <div>
      {{#if this.loadDocuments.isIdle}}
        <AuTable @size="small" class="au-table-test">
          <:header>
            <tr>
              <th>Naam</th>
              <th>Ingezonden door</th>
              <th>Ingezonden op</th>
              {{#unless this.isReadOnly}}
                <th></th>
              {{/unless}}
            </tr>
          </:header>
          <:body>
            {{#if this.loadDocuments.last.isSuccessful}}
              {{#each this.documents as |document|}}
                <DocumentDetails
                  @document={{document}}
                  @isReadOnly={{this.isReadOnly}}
                  @onRemove={{fn this.removeDocument document}}
                />
              {{else}}
                <tr>
                  <td colspan="4">Er werden nog geen documenten toegevoegd</td>
                </tr>
              {{/each}}
            {{else}}
              <tr>
                <td colspan="4">
                  <AuHelpText @error={{true}} class="au-u-margin-top-none">
                    Er ging iets fout bij het opvragen van de documenten
                  </AuHelpText>
                </td>
              </tr>
            {{/if}}
          </:body>
        </AuTable>

        {{#unless this.isReadOnly}}
          <AuButton
            @icon={{AddIcon}}
            @skin="secondary"
            @width="block"
            class="au-u-margin-top-small"
            {{on "click" (fn (mut this.showModal) true)}}
          >
            Voeg documenten toe
          </AuButton>

          {{#if this.showModal}}
            <AddDocumentsModal
              {{! eredienstbesturen }}
              @eenheidConceptScheme="http://lblod.data.gift/concept-schemes/04c8d012-cc8e-4f68-9908-69cc38adf040"
              @decisionType={{this.decisionType}}
              @addedDocuments={{this.documents}}
              @formStore={{@formStore}}
              @metaGraph={{@graphs.metaGraph}}
              @onClose={{fn (mut this.showModal)}}
              @onAdd={{this.addDocuments}}
            />
          {{/if}}
        {{/unless}}

        {{#if this.hasErrors}}
          <AuHelpText @error={{true}}>
            Gelieve minstens 1 document toe te voegen
          </AuHelpText>
        {{/if}}
      {{else}}
        <AuLoader>Gegevens aan het laden</AuLoader>
      {{/if}}
    </div>
  </template>
}

const DocumentDetails = <template>
  <tr>
    <td>
      <AuLinkExternal href={{@document.link}}>
        {{@document.name}}
      </AuLinkExternal>
    </td>
    <td>{{@document.sentBy.name}}</td>
    <td>{{formatDate @document.sentDate}}</td>
    {{#unless @isReadOnly}}
      <td>
        <AuButton
          @skin="naked"
          @alert={{true}}
          @hideText={{true}}
          @icon={{BinIcon}}
          {{on "click" @onRemove}}
        >
          Verwijder
        </AuButton>
      </td>
    {{/unless}}
  </tr>
</template>;
