import AuBadge from '@appuniversum/ember-appuniversum/components/au-badge';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import AuCheckbox from '@appuniversum/ember-appuniversum/components/au-checkbox';
import AuHeading from '@appuniversum/ember-appuniversum/components/au-heading';
import AuHelpText from '@appuniversum/ember-appuniversum/components/au-help-text';
import AuIcon from '@appuniversum/ember-appuniversum/components/au-icon';
import AuLabel from '@appuniversum/ember-appuniversum/components/au-label';
import AuLinkExternal from '@appuniversum/ember-appuniversum/components/au-link-external';
import AuLoader from '@appuniversum/ember-appuniversum/components/au-loader';
import AuModal from '@appuniversum/ember-appuniversum/components/au-modal';
import AuPill from '@appuniversum/ember-appuniversum/components/au-pill';
import AuTable from '@appuniversum/ember-appuniversum/components/au-table';
import { AddIcon } from '@appuniversum/ember-appuniversum/components/icons/add';
import { BinIcon } from '@appuniversum/ember-appuniversum/components/icons/bin';
import { CrossIcon } from '@appuniversum/ember-appuniversum/components/icons/cross';
import { InfoCircleIcon } from '@appuniversum/ember-appuniversum/components/icons/info-circle';
import { SearchIcon } from '@appuniversum/ember-appuniversum/components/icons/search';
import { NavLeftIcon } from '@appuniversum/ember-appuniversum/components/icons/nav-left';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { registerFormFields } from '@lblod/ember-submission-form-fields';
import {
  RDF,
  registerCustomValidation,
  SHACL,
  SKOS,
  validationsForFieldWithType,
} from '@lblod/submission-form-helpers';
import { task } from 'ember-concurrency';
import PowerSelect from 'ember-power-select/components/power-select';
import eq from 'ember-truth-helpers/helpers/eq';
import not from 'ember-truth-helpers/helpers/not';
import worshipDecisionsDatabaseUrl from 'frontend-loket/helpers/worship-decisions-database-url';
import { BESLUIT, ELI, EXT } from 'frontend-loket/rdf/namespaces';
import { Literal, NamedNode, parse, Store } from 'rdflib';
import { v4 as uuid } from 'uuid';

const hasPart = ELI('has_part');
const documentType = ELI('type_document');
const refersTo = ELI('refers_to');
const prefLabel = SKOS('prefLabel');
const shOrder = SHACL('order');

export function registerFormField() {
  registerFormFields([
    {
      displayType: 'http://lblod.data.gift/display-types/decisionArticles',
      edit: DecisionArticlesField,
    },
  ]);

  registerFieldValidator();
}

/// Components
class DecisionArticlesField extends Component {
  @tracked articles = [];

  constructor() {
    super(...arguments);

    this.loadArticles.perform();
  }

  get isReadOnly() {
    return this.args.show;
  }

  get hasErrors() {
    return this.args.forceShowErrors && this.articles.length === 0;
  }

  get isRequired() {
    // TODO: Not sure if we want the validator for this or if we just always assume it's required, needs more testing
    return (
      !this.isReadOnly &&
      isRequiredField(
        this.args.field.uri,
        this.args.formStore,
        this.args.graphs.formGraph,
      )
    );
  }

  get isDocumentTypeRequired() {
    return !isDocumentTypeOptional(
      this.args.formStore,
      this.args.field.uri,
      this.args.graphs.formGraph,
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

  loadArticles = task(async () => {
    // This is needed to the rest of the method happens _after_ the willDestroy method of previous component instances,
    // otherwise we would simply load the old data again before it was removed from the store.
    await Promise.resolve();

    const {
      formStore,
      sourceNode,
      graphs: { sourceGraph },
    } = this.args;
    const triples = formStore.match(
      sourceNode,
      hasPart,
      undefined,
      sourceGraph,
    );

    const articles = triples.map((triple) => {
      const article = triple.object;
      const order = formStore.any(article, shOrder, undefined, sourceGraph);

      return {
        node: article,
        order,
      };
    });

    // We add sh:order predicates if the sourceGraph doesn't contain them yet
    // (which could be possible if the decision wasn't created through the Toezicht module)
    if (
      !this.isReadOnly &&
      articles.some((article) => typeof article.order === 'undefined')
    ) {
      articles.map((article, index) => {
        article.order = index + 1;

        formStore.addAll([
          {
            subject: article.node,
            predicate: shOrder,
            object: article.order,
            graph: sourceGraph,
          },
        ]);

        return article;
      });
    } else {
      articles.sort(byOrder);
    }

    this.articles = articles;
  });

  createArticle = () => {
    const article = articleNode();
    const nextOrder = this.articles.at(-1)?.order + 1 || 1;
    this.articles = [...this.articles, { node: article, order: nextOrder }];

    const {
      formStore,
      sourceNode,
      graphs: { sourceGraph },
    } = this.args;

    const triples = [
      {
        subject: sourceNode,
        predicate: hasPart,
        object: article,
        graph: sourceGraph,
      },
      {
        subject: article,
        predicate: RDF('type'),
        object: BESLUIT('Artikel'),
        graph: sourceGraph,
      },
      {
        subject: article,
        predicate: shOrder,
        object: nextOrder,
        graph: sourceGraph,
      },
    ];
    formStore.addAll(triples);
  };

  removeArticle = (articleToRemove) => {
    this.articles = this.articles.filter(
      (article) => article !== articleToRemove,
    );

    const {
      formStore,
      sourceNode,
      graphs: { sourceGraph },
    } = this.args;

    const triples = [
      {
        subject: sourceNode,
        predicate: hasPart,
        object: articleToRemove.node,
        graph: sourceGraph,
      },
      ...formStore.match(
        articleToRemove.node,
        undefined,
        undefined,
        sourceGraph,
      ),
    ];
    formStore.removeStatements(triples);
  };

  willDestroy() {
    super.willDestroy(...arguments);

    this.articles.forEach((article) => {
      this.removeArticle(article);
    });
  }

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

    {{#if this.articles}}
      <ul class="au-o-flow au-o-flow--small">
        {{#each this.articles as |article index|}}
          <li>
            <ArticleDetails
              @article={{article.node}}
              @count={{plusOne index}}
              @isReadOnly={{this.isReadOnly}}
              @onRemove={{fn this.removeArticle article}}
              @formStore={{@formStore}}
              @sourceGraph={{@graphs.sourceGraph}}
              @metaGraph={{@graphs.metaGraph}}
              @decisionType={{this.decisionType}}
              @forceShowErrors={{@forceShowErrors}}
              @isDocumentTypeRequired={{this.isDocumentTypeRequired}}
            />
          </li>
        {{/each}}
      </ul>
    {{else}}
      <div class="au-u-text-center">
        <AuHelpText>
          Er werden nog geen artikels toegevoegd
        </AuHelpText>
      </div>
    {{/if}}

    {{#unless this.isReadOnly}}
      <div class="au-u-text-center au-u-margin-top-small">
        <AuButton
          @icon={{AddIcon}}
          @skin="secondary"
          @width="block"
          {{on "click" this.createArticle}}
        >
          Voeg artikel toe
        </AuButton>
      </div>
    {{/unless}}

    {{#if this.hasErrors}}
      <AuHelpText @error={{true}}>
        Gelieve minstens 1 artikel toe te voegen
      </AuHelpText>
    {{/if}}
  </template>
}

class ArticleDetails extends Component {
  @tracked showModal = false;
  @tracked type;
  @tracked decisions;

  constructor() {
    super(...arguments);

    this.loadData.perform();
  }

  get hasTypeError() {
    return (
      this.args.isDocumentTypeRequired &&
      this.args.forceShowErrors &&
      !this.type
    );
  }

  get hasDecisionsError() {
    return this.args.forceShowErrors && this.decisions.length === 0;
  }

  loadData = task(async () => {
    const { article, formStore, sourceGraph } = this.args;

    this.type = formStore.any(article, documentType, undefined, sourceGraph);

    const decisionsPromises = formStore
      .match(article, refersTo, undefined, sourceGraph)
      .map((triple) => triple.object)
      .map(async (decisionNode) => {
        const url = new URL(
          '/related-document-information',
          window.location.origin,
        );

        url.searchParams.append('forRelatedDecision', decisionNode.uri);
        const response = await fetch(url);

        if (response.ok) {
          const ttlData = await response.text();

          if (ttlData.length > 0) {
            let data = ttlToJs(ttlData);

            return data.at(0);
          }
        } else {
          throw new Error(
            'Something went wrong while retrieving related document information',
          );
        }
      });

    const decisions = await Promise.all(decisionsPromises);

    this.decisions = decisions;
  });

  handleTypeChange = (type) => {
    this.type = type;

    const { article, formStore, sourceGraph } = this.args;

    const currentTypes = formStore.match(
      article,
      documentType,
      undefined,
      sourceGraph,
    );
    if (currentTypes.length > 0) {
      formStore.removeStatements(currentTypes);
    }

    formStore.addAll([
      {
        subject: article,
        predicate: documentType,
        object: type,
        graph: sourceGraph,
      },
    ]);
  };

  addDecisions = (decisionsToAdd) => {
    this.decisions = [...this.decisions, ...decisionsToAdd];

    const { article, formStore, sourceGraph } = this.args;
    const statements = decisionsToAdd.map((decision) => {
      return {
        subject: article,
        predicate: refersTo,
        object: decision.node,
        graph: sourceGraph,
      };
    });

    formStore.addAll(statements);

    this.showModal = false;
  };

  removeDecision = (decisionToRemove) => {
    this.decisions = this.decisions.filter(
      (decision) => decision !== decisionToRemove,
    );

    const { article, formStore, sourceGraph } = this.args;
    formStore.removeStatements([
      {
        subject: article,
        predicate: refersTo,
        object: decisionToRemove.node,
        graph: sourceGraph,
      },
    ]);
  };

  <template>
    <div class="decision-article-field-details" ...attributes>
      <div class="au-u-flex au-u-flex--between au-u-margin-bottom">
        <AuHeading @level="2" @skin="4">
          Artikel
          {{@count}}
        </AuHeading>

        {{#unless @isReadOnly}}
          <AuButton
            @skin="naked"
            @icon={{BinIcon}}
            @hideText={{true}}
            @alert={{true}}
            {{on "click" @onRemove}}
          >
            Artikel verwijderen
          </AuButton>
        {{/unless}}
      </div>

      {{#if this.loadData.isIdle}}
        {{#if @isDocumentTypeRequired}}
          <ConceptSchemeSelect
            @formStore={{@formStore}}
            @metaGraph={{@metaGraph}}
            {{! Article types }}
            @conceptScheme="http://data.lblod.info/concept-schemes/aeb364c6-768a-4a6b-8cbf-a681d1a6b8b6"
            @selected={{this.type}}
            @onChange={{this.handleTypeChange}}
            @isReadOnly={{@isReadOnly}}
            @error={{if this.hasTypeError "Dit veld is verplicht"}}
            @required={{not @isReadOnly}}
            class="au-u-margin-bottom"
          >
            <:label>Artikeltype</:label>
          </ConceptSchemeSelect>
        {{/if}}

        <AuTable @size="small" class="au-table-test">
          <:title>
            {{#if this.hasDecisionsError}}
              <ErrorBadge />
            {{/if}}
            Documenten
            {{#unless @isReadOnly}}
              <RequiredPill />
            {{/unless}}
          </:title>
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
            {{#if this.loadData.last.isSuccessful}}
              {{#each this.decisions as |decision|}}
                <tr>
                  <td>
                    <AuLinkExternal href={{decision.link}}>
                      {{decision.name}}
                    </AuLinkExternal>
                  </td>
                  <td>{{decision.sentBy.name}}</td>
                  <td>{{formatDate decision.sentDate}}</td>
                  {{#unless @isReadOnly}}
                    <td>
                      <AuButton
                        @skin="naked"
                        @alert={{true}}
                        @hideText={{true}}
                        @icon={{BinIcon}}
                        {{on "click" (fn this.removeDecision decision)}}
                      >
                        Verwijder
                      </AuButton>
                    </td>
                  {{/unless}}
                </tr>
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

        {{#unless @isReadOnly}}
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
            <AddDecisionsModal
              @decisionType={{@decisionType}}
              @addedDecisions={{this.decisions}}
              @formStore={{@formStore}}
              @metaGraph={{@metaGraph}}
              @onClose={{fn (mut this.showModal)}}
              @onAdd={{this.addDecisions}}
            />
          {{/if}}
        {{/unless}}

        {{#if this.hasDecisionsError}}
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

class AddDecisionsModal extends Component {
  @tracked org;
  @tracked selectedDecisions = [];
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
      '/related-document-information',
      window.location.origin,
    );
    url.searchParams.append('forDecisionType', this.args.decisionType.uri);
    url.searchParams.append('forEenheid', this.org.uri);
    const response = await fetch(url);

    if (response.ok) {
      const ttlData = await response.text();

      if (ttlData.length > 0) {
        let data = ttlToJs(ttlData);

        data = data.filter((decision) => {
          return !this.args.addedDecisions.some(
            (addedDecision) => addedDecision.node.uri === decision.node.uri,
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

  handleSelectionChange = (decision, selected) => {
    if (selected) {
      this.selectedDecisions = [...this.selectedDecisions, decision];
    } else {
      this.selectedDecisions = this.selectedDecisions.filter(
        (selected) => selected !== decision,
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
            {{! bestuurseenheden }}
            @conceptScheme="http://lblod.data.gift/concept-schemes/2e136902-f709-4bf7-a54a-9fc820cf9f07"
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
                    {{#each this.search.lastSuccessful.value as |decision|}}
                      <tr>
                        <td>
                          <AuCheckbox
                            @checked={{arrayIncludes
                              this.selectedDecisions
                              decision
                            }}
                            @onChange={{fn this.handleSelectionChange decision}}
                          />
                        </td>
                        <td>
                          <AuLinkExternal href={{decision.link}}>
                            {{decision.name}}
                          </AuLinkExternal>
                        </td>
                        <td>{{formatDate decision.sentDate}}</td>
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
              @disabled={{not this.selectedDecisions.length}}
              {{on "click" (fn @onAdd this.selectedDecisions)}}
            >
              {{#if (eq this.selectedDecisions.length 1)}}
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

// Based on the ember-submission-form-fields version
class ConceptSchemeSelect extends Component {
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

// Matches the Appuniversum version: https://github.com/appuniversum/ember-appuniversum/blob/f5bcb51c76333c4ac11858bdc17916f50f628bf5/addon/components/au-label.gts#L51-L56
const ErrorBadge = <template>
  <AuBadge
    @skin="error"
    @size="small"
    @icon={{CrossIcon}}
    class="au-u-margin-right-tiny"
  />
</template>;

// Matches the Appuniversum version: https://github.com/appuniversum/ember-appuniversum/blob/f5bcb51c76333c4ac11858bdc17916f50f628bf5/addon/components/au-label.gts#L67
const RequiredPill = <template>
  <AuPill>Verplicht</AuPill>
</template>;

/// Template helpers
function arrayIncludes(array, item) {
  return array.includes(item);
}

function plusOne(number) {
  return number + 1;
}

// TODO: Remove this once Appuniversum ships helpers for this
// Source: https://github.com/appuniversum/ember-appuniversum/blob/f5bcb51c76333c4ac11858bdc17916f50f628bf5/addon/utils/date.ts#L1C1-L6C2
function formatDate(date) {
  const day = `${date.getDate()}`.padStart(2, '0');
  const month = `${date.getMonth() + 1}`.padStart(2, '0');

  return `${day}-${month}-${date.getFullYear()}`;
}

/// Utils

// Source: https://github.com/lblod/ember-submission-form-fields/blob/5eb12a7794a70a04dfd1e8d392f0cc079d6aad72/addon/components/rdf-input-fields/concept-scheme-selector.js#L14C1-L18C2
function byLabel(a, b) {
  const textA = a.label.toUpperCase();
  const textB = b.label.toUpperCase();
  return textA < textB ? -1 : textA > textB ? 1 : 0;
}

function byOrder(a, b) {
  return a?.order - b?.order;
}

function articleNode() {
  return new NamedNode(`http://data.lblod.info/id/artikels/${uuid()}`);
}

function isRequiredField(fieldUri, store, formGraph) {
  const constraints = validationsForFieldWithType(fieldUri, {
    store,
    formGraph,
  });
  return constraints.some(
    (constraint) =>
      constraint.type.value ===
      'http://lblod.data.gift/vocabularies/forms/RequiredConstraint',
  );
}

function ttlToJs(ttl) {
  const store = new Store();
  const graph = new NamedNode('http://temporary-graph');
  parse(ttl, store, graph.uri);

  const decisions = store.match(
    null,
    RDF('type'),
    EXT('SubmissionDocument'),
    graph,
  );

  return decisions.map((decision) => {
    const subject = decision.subject;
    const name = store.any(subject, prefLabel, undefined, graph);
    const sentDate = store.any(
      subject,
      new NamedNode(
        'http://www.semanticdesktop.org/ontologies/2007/03/22/nmo#sentDate',
      ),
      undefined,
      graph,
    );
    const org = store.any(
      subject,
      new NamedNode('http://purl.org/pav/createdBy'),
      undefined,
      graph,
    );
    const orgName = store.any(org, SKOS('prefLabel'), undefined, graph);
    const link = store.any(
      subject,
      new NamedNode('http://www.w3.org/2000/01/rdf-schema#seeAlso'),
      undefined,
      graph,
    )?.uri;

    return {
      node: subject,
      name: name.value,
      link,
      sentDate: Literal.toJS(sentDate),
      sentBy: {
        node: org,
        name: orgName,
      },
    };
  });
}

function isDocumentTypeOptional(store, node, formGraph) {
  const literal = store.any(
    node,
    new NamedNode(
      'http://lblod.data.gift/vocabularies/form-field-options/exclude-type_document',
    ),
    undefined,
    formGraph,
  );

  return typeof literal !== 'undefined' && Literal.toJS(literal);
}

/// Custom field validations
function registerFieldValidator() {
  registerCustomValidation(
    'http://lblod.data.gift/vocabularies/forms/DecisionArticlesValidator',
    validator,
  );
}

// This validator assumes a form:Bag grouping with the `sh:path` set to `eli:has_part`
function validator(articles, options) {
  if (articles.length === 0) {
    return false;
  }

  const { constraintUri, formGraph, store, sourceGraph } = options;

  const areArticlesValid = articles
    .map((articleNode) => {
      const documents = store.match(
        articleNode,
        refersTo,
        undefined,
        sourceGraph,
      );

      if (documents.length === 0) {
        return false;
      }

      const isTypeOptional = isDocumentTypeOptional(
        store,
        constraintUri,
        formGraph,
      );

      if (isTypeOptional) {
        return true;
      }

      const type = store.any(articleNode, documentType, undefined, sourceGraph);

      return Boolean(type);
    })
    .every(Boolean);

  return areArticlesValid;
}
