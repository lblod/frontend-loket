import AuBadge from '@appuniversum/ember-appuniversum/components/au-badge';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import AuHeading from '@appuniversum/ember-appuniversum/components/au-heading';
import AuHelpText from '@appuniversum/ember-appuniversum/components/au-help-text';
import AuIcon from '@appuniversum/ember-appuniversum/components/au-icon';
import AuLabel from '@appuniversum/ember-appuniversum/components/au-label';
import AuLinkExternal from '@appuniversum/ember-appuniversum/components/au-link-external';
import AuLoader from '@appuniversum/ember-appuniversum/components/au-loader';
import AuPill from '@appuniversum/ember-appuniversum/components/au-pill';
import AuTable from '@appuniversum/ember-appuniversum/components/au-table';
import { AddIcon } from '@appuniversum/ember-appuniversum/components/icons/add';
import { BinIcon } from '@appuniversum/ember-appuniversum/components/icons/bin';
import { CrossIcon } from '@appuniversum/ember-appuniversum/components/icons/cross';
import { InfoCircleIcon } from '@appuniversum/ember-appuniversum/components/icons/info-circle';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { registerFormFields } from '@lblod/ember-submission-form-fields';
import {
  RDF,
  registerCustomValidation,
  SHACL,
} from '@lblod/submission-form-helpers';
import { task } from 'ember-concurrency';
import not from 'ember-truth-helpers/helpers/not';
import worshipDecisionsDatabaseUrl from 'frontend-loket/helpers/worship-decisions-database-url';
import { BESLUIT, ELI } from 'frontend-loket/rdf/namespaces';
import { isRequiredField } from 'frontend-loket/utils/semantic-forms';
import { byOrder } from 'frontend-loket/utils/sort';
import { Literal, NamedNode } from 'rdflib';
import { v4 as uuid } from 'uuid';
import { ConceptSchemeSelect } from './-shared/concept-scheme-select';
import { AddDocumentsModal } from './-shared/add-documents-modal';
import {
  extractDocumentsFromTtl,
  getSelectedDecisionType,
} from './-shared/utils';
import momentFormat from 'ember-moment/helpers/moment-format';

const hasPart = ELI('has_part');
const documentType = ELI('type_document');
const refersTo = ELI('refers_to');
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
const OBSERVER_KEY = 'decision-articles';
class DecisionArticlesField extends Component {
  @tracked articles = [];
  @tracked decisionType;

  constructor() {
    super(...arguments);

    this.decisionType = getSelectedDecisionType({
      formStore: this.args.formStore,
      sourceNode: this.args.sourceNode,
      graphs: this.args.graphs,
    });
    this.loadArticles.perform();

    this.args.formStore.registerObserver(() => {
      if (!this.isDestroying && !this.isDestroyed) {
        const decisionType = getSelectedDecisionType({
          formStore: this.args.formStore,
          sourceNode: this.args.sourceNode,
          graphs: this.args.graphs,
        });

        if (decisionType !== this.decisionType) {
          // If the user changed the type of the decision, then we need to remove all previously created articles, since they are no longer valid.
          this.removeAllArticles();
          this.decisionType = decisionType;
        }
      }
    }, OBSERVER_KEY);
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

  removeAllArticles() {
    this.articles.forEach((article) => {
      this.removeArticle(article);
    });
  }

  willDestroy() {
    super.willDestroy(...arguments);

    this.args.formStore.deregisterObserver(OBSERVER_KEY);
    this.removeAllArticles();
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

  get eenheidConceptScheme() {
    // If the decision type is `Opvragen bijkomende inlichtingen eredienstbesturen (met als gevolg stuiting termijn)` or
    // `Schorsing beslissing eredienstbesturen`, we need CKBs in the dropdown select. Else, only EB.
    if (
      this.args.decisionType.value ==
        'https://data.vlaanderen.be/id/concept/BesluitDocumentType/24743b26-e0fb-4c14-8c82-5cd271289b0e' ||
      this.args.decisionType.value ==
        'https://data.vlaanderen.be/id/concept/BesluitType/b25faa84-3ab5-47ae-98c0-1b389c77b827'
    ) {
      return 'http://lblod.data.gift/concept-schemes/362a6a78-6431-4d0a-b20d-22f1faca4130';
    }

    return 'http://lblod.data.gift/concept-schemes/2e136902-f709-4bf7-a54a-9fc820cf9f07';
  }

  loadData = task(async () => {
    const { article, formStore, sourceGraph } = this.args;

    this.type = formStore.any(article, documentType, undefined, sourceGraph);

    const decisionsPromises = formStore
      .match(article, refersTo, undefined, sourceGraph)
      .map((triple) => triple.object)
      .map(async (decisionNode) => {
        const url = new URL(
          '/worship-decisions-cross-reference/document-information',
          window.location.origin,
        );

        url.searchParams.append('forDecisionType', this.args.decisionType.uri);
        url.searchParams.append('forRelatedDecision', decisionNode.uri);
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
                  <td>{{momentFormat decision.sentDate "DD-MM-YYYY H:mm"}}</td>
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
            <AddDocumentsModal
              {{! bestuurseenheden }}
              @eenheidConceptScheme={{this.eenheidConceptScheme}}
              @decisionType={{@decisionType}}
              @addedDocuments={{this.decisions}}
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
function plusOne(number) {
  return number + 1;
}

/// Utils
function articleNode() {
  return new NamedNode(`http://data.lblod.info/id/artikels/${uuid()}`);
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
